from Beck_and_Call_API.calculation import GuiManager
from Beck_and_Call_API.calculation.load_r import r_script
from functools import partial
import csv
import tkMessageBox

def parsecsv(filename, negociacion):
    HistoricalData = []
    with open(filename) as csvData:
        readCSV = csv.reader(csvData, delimiter=',')
        businessDays = negociacion
        day = -1
        for row in readCSV:
            if day == businessDays:
                break
            if day >= 0:
                HistoricalData.append(float(row[1]))
            day += 1
    return HistoricalData

def calcular(gui):
    dias = int(gui.getEntries()["Dias de negociacion"].get())
    precio = int(gui.getEntries()["Precio ejercicio"].get())
    delay = int(gui.getEntries()["Delay"].get())
    disc = int(gui.getEntries()["Grado de discretizacion"].get())
    simu = int(gui.getEntries()["Numero de simulaciones"].get())
    tipo = gui.getEntries()["Tipo de opcion"].get()
    tasa = float(gui.getEntries()["Tasa libre de riesgo"].get())
    csvFile = gui.getEntries()["csv"].get()

    HistoricalData = parsecsv(csvFile, dias)
    resultado = r_script("../r_scripts/slave.R").load_function("MonteCarloSimulation",
                         dias,
                         HistoricalData[0],#stock current value
                         precio,#strike price
                         delay,#delay
                         disc,#discretization degree
                         HistoricalData,#daily open value of stock
                         simu,#number of simulations
                         tipo,#type of option
                         tasa,#risk-free rate
                         )[0]
    tkMessageBox.showinfo("Resultado", str(resultado))
    return


gui = GuiManager.GuiManager()
gui.addPanel("Beck&Call", 
    ["Dias de negociacion", "Precio ejercicio", "Delay", "Grado de discretizacion", "Numero de simulaciones", "Tipo de opcion", "Tasa libre de riesgo", "csv"],
    [("Entry", "126"), ("Entry", "13"), ("Entry", "0"), ("Entry", "100"), ("Entry", "10000"), ("Entry", "put"), ("Entry", "0.0221"), ("Entry", "../../csvs/daily_AMD.csv")], 
    ["Calcular", partial(calcular, gui)])
gui.start()