from __future__ import print_function

import socket
import ssl


class SecureConnection(object):
    NETBUFFER = 1024
    ERROR = "\x00"

    def __init__(self, ip, port, certFile, keyFile):
        # type: (str, int, str, str) -> None
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.host = ip
        self.port = port
        self.timeout = None
        self.context = None
        self.certFile = certFile
        self.keyFile = keyFile
        self.connection = None
        self.client = None
        self.connected = False
        return

    def bindServer(self):
        # type: (None) -> None
        self.sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        self.sock.bind((self.host, self.port))
        self.sock.listen(5)
        self.context = ssl.create_default_context(ssl.Purpose.CLIENT_AUTH)
        self.context.load_cert_chain(self.certFile, keyfile=self.keyFile)  # 1. key, 2. cert, 3. intermediates
        self.context.set_ciphers('EECDH+AESGCM:EDH+AESGCM:AES256+EECDH:AES256+EDH')
        return

    def accept(self):
        # type: (None) -> None
        if not self.connected:
            ssock, addr = self.sock.accept()
            self.client = addr
            self.connection = self.context.wrap_socket(ssock, server_side=True)
            self.connected = True
            return
        else:
            raise Exception("Already connected.")

    def recv(self):
        # type: (None) -> str
        if self.connected:
            return self.connection.recv(self.NETBUFFER)
        else:
            raise Exception("Not connected")

    def send(self, msg):
        # type: (str) -> None
        if self.connected:
            return self.connection.send(msg)
        else:
            raise Exception("Not connected")

    def close(self):
        self.connection.close()
        self.sock.close()
        self.connected = False


HOST = '127.0.0.1'
PORT = 8080
CERT = 'cert/cert.pem'
KEY = 'cert/private.key'

if __name__ == '__main__':
    conn = SecureConnection(HOST, PORT, CERT, KEY)
    conn.bindServer()
    print("Waiting connections...")
    conn.accept()
    data = None
    conn.send("Hi. Type 0 to exit")
    while data != "0":
        data = conn.recv()
        print(data)
        conn.send(data)
    conn.close()
    # main()
