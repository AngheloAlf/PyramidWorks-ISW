from django.contrib.auth.models import User, Group
from .models import Company, Option, Stock
from rest_framework import viewsets, generics, mixins
from .serializers import UserSerializer, GroupSerializer, StockSerializer, OptionCompanySerializer, CompanySerializer, OptionSerializer
import requests
from . import AlphaVantageService

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
        company = serializer.save()
        AlphaVantageService.addAllCompanyStocks(company)


class CompanyUpdateDestroyView( mixins.RetrieveModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin, generics.GenericAPIView):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)


class StockList(generics.ListAPIView):
    serializer_class = StockSerializer

    def get_queryset(self):
        company = Company.objects.get(id=int(self.kwargs['pk']))
        if self.request.GET.get("length") == "all" or self.request.GET.get("length") is None:
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

    option = Option.objects.filter(id=option_id)[0]
    strike_price = option.strike_price
    if option.type:
        option_type = 'put'
    else:
        option_type = 'call'
    print(option)
    hd = option.company.stock_set.all().order_by('-date')[:days]
    historical_data = list(map(lambda x: float(x.open_price), hd))
    script = load_r.r_script('local_API/calculation/r_scripts/slave.R')
    if(days == 0):
        result = 0
    else:
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

        option.pricing = result
        option.save()

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
    company = Company.objects.get(id=int(company_id))
    AlphaVantageService.addNewCompanyStocks(company)

    return JsonResponse({'error': 'None', 'done': 'done'})


def updateAllStocks(request):
    responses_dict = dict()
    for x in Company.objects.all():
        print(x.id)
        responses_dict[x.id] = updateStocksCompany(request, x.id)
    return JsonResponse({'error': 'None', 'responses': responses_dict})
