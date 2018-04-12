import numpy
# import scipy as sp
# import pandas
# from rpy2.robjects.packages import importr
import rpy2.robjects as ro
# import pandas.rpy.common as com


def transform_list_to_vector(liste):
    aux = "c("
    first = True
    for i in liste:
        if first:
            first = False
        else:
            aux += ", "
        aux += str(i)
    return aux + ")"


class r_script(object):
    """docstring for r_script
    filename: filename of r script
    """

    def __init__(self, filename):
        super(r_script, self).__init__()
        self.r = ro
        self.filename = filename
        _file = open(filename)
        self.file_data = []
        aux_data = ""
        braces_counter = 0
        for i in _file:
            # Accept comments
            if "{" in i:
                braces_counter += 1
            if "}" in i:
                braces_counter -= 1
            aux = i.strip().split("#")[0]
            if aux == "":
                continue
            aux_data += aux + "\n "
            if braces_counter == 0:
                self.file_data.append(aux_data)
                aux_data = ""
        _file.close()
        # print(self.file_data)
        # print(self.file_data)
        for i in self.file_data:
            self.r.r(i)

    """
    Calls a R function and return a numpy array with the results of the vector.
    function_call: string with R function name
    *data: all the arguments for the function "function_call". It accept numbers, strings, and lists (converted to R vector)
    """
    def load_function(self, function_call, *data):
        aux = function_call + "("
        first = True
        for i in data:
            if first:
                first = False
            else:
                aux += ", "
            if type(i) == list:
                aux += transform_list_to_vector(i)
            elif type(i) == str:
                aux += '"' + i + '"'
            else:
                aux += str(i)
        aux += ")"
        return numpy.asarray(self.r.r(aux))


if __name__ == "__main__":
    r_script("../r_scripts/dummy.r").load_function("dummyFunc2", 4, 4.5)
