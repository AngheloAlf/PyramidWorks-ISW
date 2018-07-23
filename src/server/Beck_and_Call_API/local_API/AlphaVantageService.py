import requests
from .models import Company, Option, Stock
from django.core.exceptions import ObjectDoesNotExist
from datetime import date, timedelta


Alpha_Vantage_API_KEY = 'ZP37OWO9E0ZEXJY4'


def countDays(lastdate):
    todate = date.today()
    daygenerator = (lastdate + timedelta(x + 1) for x in range((todate - lastdate).days))
    return sum(1 for day in daygenerator if day.weekday() < 5)


def getStockReady(company, key, val):
    return Stock(date=key, open_price=val['1. open'], high=val["2. high"], low=val["3. low"], close=val["4. close"],
                 volume=val["5. volume"], company=company)


def getCompanyStocks(ticket, days_passed):
    payload = {
        'function': 'TIME_SERIES_DAILY',
        'symbol': ticket,
        'outputsize': 'compact' if days_passed < 100 else 'full',
        'apikey': Alpha_Vantage_API_KEY,
    }
    return requests.get('https://www.alphavantage.co/query', params=payload).json()['Time Series (Daily)']


def addAllCompanyStocks(company):
    stocks_list = getCompanyStocks(company.ticker, float('inf'))
    Stock.objects.bulk_create([getStockReady(company, key, val) for key, val in stocks_list.items()])


def addNewCompanyStocks(company):
    last_stock = Stock.objects.filter(company=company.id).all().order_by('-date')[0]
    diferencia = countDays(last_stock.date)
    print("diferencia: ", diferencia)

    ticket = company.ticker
    stocks_list = getCompanyStocks(ticket, diferencia)
    stocks_to_add = list()

    for key, val in stocks_list.items():
        try:
            Stock.objects.filter(company=company.id).get(date=key)
        except ObjectDoesNotExist:
            stocks_to_add.append(getStockReady(company, key, val))

    Stock.objects.bulk_create(stocks_to_add)
