 # Create your views here.
from django.contrib.auth.models import User, Group
from .models import Company, Option, Stock
from rest_framework import viewsets, generics, mixins
from .serializers import UserSerializer, GroupSerializer, StockSerializer, OptionCompanySerializer, CompanySerializer
import requests

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


class CompanyUpdateDestroyView( mixins.RetrieveModelMixin,
                                mixins.UpdateModelMixin,
                                mixins.DestroyModelMixin,
                                generics.GenericAPIView):
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
        if self.request.GET.get("length") == "all":
            return company.stock_set.all().order_by('-date')
        return company.stock_set.all().order_by('-date')[:int(self.request.GET.get("length"))]