 # Create your views here.
from django.contrib.auth.models import User, Group
from .models import Company, Option, Stock
from rest_framework import viewsets, generics, mixins
from .serializers import UserSerializer, GroupSerializer, StockSerializer, OptionCompanySerializer, CompanySerializer, OptionSerializer
import requests

from .calculation import load_r
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.core.exceptions import ObjectDoesNotExist

Alpha_Vantage_API_KEY = 'ZP37OWO9E0ZEXJY4'

class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer


class OptionViewSet(viewsets.ModelViewSet):
    queryset = Option.objects.all()
    serializer_class = OptionCompanySerializer


class CompanyListCreateView(generics.ListCreateAPIView):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer

    def perform_create(self, serializer):
        company_data = serializer.validated_data
        payload = {
            'function': 'TIME_SERIES_DAILY',
            'symbol': company_data['ticker'],
            'outputsize': 'full',
            'apikey': Alpha_Vantage_API_KEY}
        Stock_data = requests.get('https://www.alphavantage.co/query', params=payload).json()['Time Series (Daily)']
        company = serializer.save()
        Stock.objects.bulk_create([Stock(date=key, open_price=val['1. open'], company=company) for key, val in Stock_data.items()])
        '''
        for key, val in Stock_data.items():
            Stock(date=key, open_price=val['1. open'], company=company).save()
        '''
        '''
        except KeyError:
            print("Error, no hay registros de la compañia " + payload['symbol'])
        except:
            print("Error desconocido")'''


class CompanyUpdateDestroyView( mixins.RetrieveModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin, generics.GenericAPIView):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, *kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)


class StockList(generics.ListAPIView):
    serializer_class = StockSerializer

    def get_queryset(self):
        company = Company.objects.get(id=int(self.kwargs['pk']))
        if self.request.GET.get("length") == "all" or self.request.GET.get("length") == None:
            return company.stock_set.all().order_by('-date')
        return company.stock_set.all().order_by('-date')[:int(self.request.GET.get("length"))]

 # TODO> Move this outside of the views
def getCalculation(request):
    if request.method != 'GET':
        return JsonResponse({'error': 'GET', 'value': 0})
    if 'id' not in request.GET or 'days' not in request.GET or 'delay' not in request.GET or 'disc' not in request.GET or 'simu' not in request.GET or 'tasa' not in request.GET:
        return JsonResponse({'error': 'parameters', 'value': 0})

    option_id = int(request.GET['id'])
    days = int(request.GET['days'])
    delay = int(request.GET['delay'])
    disc = int(request.GET['disc'])
    simu = int(request.GET['simu'])
    tasa = float(request.GET['tasa'])

    option = Option.objects.filter(id=option_id)
    strike_price = option[0].strike_price
    if option[0].type:
        option_type = 'put'
    else:
        option_type = 'call'

    hd = option[0].company.stock_set.all().order_by('-date')[:days]
    historical_data = list(map(lambda x: float(x.open_price), hd))

    script = load_r.r_script('local_API/calculation/r_scripts/slave.R')
    result = script.load_function("MonteCarloSimulation",
                         days,
                         historical_data[0],#stock current value
                         strike_price,#strike price
                         delay,#delay
                         disc,#discretization degree
                         historical_data,#daily open value of stock
                         simu,#number of simulations
                         option_type,#type of option
                         tasa,#risk-free rate
                         )[0]

    return JsonResponse({'error': 'None', 'value': result})


class CompanyOptionList(generics.ListCreateAPIView):
    serializer_class = OptionSerializer

    def get_queryset(self):
        return Option.objects.filter(company=int(self.kwargs['pk']))

    def perform_create(self, serializer):
        serializer.save(company_id=int(self.kwargs['pk']))


class CompanyOptionUpdateDelete(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = OptionSerializer
    def get_queryset(self):
        return Option.objects.filter(company=int(self.kwargs['pk']))

    def get_object(self):
        queryset = self.get_queryset()
        return get_object_or_404(queryset, id=int(self.kwargs['opt_id']))


def updateStocksCompany(request, company_id):
    comp_id = int(company_id)
    company = Company.objects.get(id=comp_id)
    ticket = company.ticker

    payload = {
        'function': 'TIME_SERIES_DAILY',
        'symbol': ticket,
        'outputsize': 'full',
        'apikey': Alpha_Vantage_API_KEY}
    Stock_data = requests.get('https://www.alphavantage.co/query', params=payload).json()['Time Series (Daily)']
    stocks_to_add = list()
    for key, val in Stock_data.items():
        try:
            Stock.objects.filter(open_price=val['1. open'], company=comp_id).get(date=key)
        except ObjectDoesNotExist:
            stocks_to_add.append(Stock(date=key, open_price=val['1. open'], company=company))

    Stock.objects.bulk_create(stocks_to_add)
    return JsonResponse({'error': 'None', 'done': 'done'})
