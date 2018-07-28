server:
	cd src/server/Beck_and_Call_API && python3 manage.py runserver

interface_web:
	cd material-dashboard-angular && npm install --save && npm start

interface_exe:
	cd material-dashboard-angular && npm install --save && npm run electron-build
	
	
