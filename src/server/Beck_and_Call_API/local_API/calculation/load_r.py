import numpy
# import scipy as sp
# import pandas
# from rpy2.robjects.packages import importr
import rpy2.robjects as ro
import csv
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
    HistoricalData = []
    with open('../../csvs/daily_AMD.csv') as csvData:
        readCSV = csv.reader(csvData, delimiter=',')
        businessDays = 126
        day = -1
        for row in readCSV:
            if day == businessDays:
                break
            if day >= 0:
                HistoricalData.append(float(row[1]))
            day += 1
    #print(r_script("../r_scripts/slave.R").load_function("volatility", 126, HistoricalData)[0])
    """Simulate(0.2, 0.4, runif(1, -1e+5, 1e+5), 1, 100, 1)"""
    #print(r_script("../r_scripts/slave.R").load_function("Simulate", 0.2, 0.4, 20, 1, 100, 1)[0])
    """MonteCarloSimulation <- 
    function(businessDays, x, k, t, n, historicalData, numberOfSimulations, typeOfInv, riskFreeRate)"""
    print(r_script("../r_scripts/slave.R")
          .load_function("MonteCarloSimulation",
                         businessDays,
                         HistoricalData[0],#stock current value
                         13,#strike price
                         0,#delay
                         100,#discretization degree
                         HistoricalData,#daily open value of stock
                         10000,#number of simulations
                         'put',#type of option
                         0.0221,#risk-free rate
                         )[0])
