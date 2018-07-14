 # Create your views here.
from django.contrib.auth.models import User, Group
from .models import Company, Option, Stock
from rest_framework import viewsets, generics, mixins
from .serializers import UserSerializer, GroupSerializer, StockSerializer, OptionCompanySerializer, CompanySerializer
import requests
from .calculation import load_r

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


def getCalculation(request):


    option_id = int(request.GET['id'])
    days = int(request.GET['days'])
    delay = int(request.GET['delay'])
    disc = int(request.GET['disc'])
    simu = int(request.GET['simu'])
    tasa = float(request.GET['tasa'])

    print('wea de la wea')

    option = Option.objects.filter(id=option_id)
    if option[0].type:
        option_type = 'put'
    else:
        option_type = 'call'
    strike_price = option[0].strike_price

    print('wea de la wea')

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

    print(result)


    # historical_data_url = '/api/company/5/stocks/?length=' + str(days)

    print('wea de la wea')

