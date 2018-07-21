from django.contrib.auth.models import User, Group
from .models import Company, Stock, Option
from rest_framework import serializers


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('url', 'username', 'email', 'groups')


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ('url', 'name')


class StockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stock
        fields = ('open_price', 'date', 'close', 'high', 'low', 'volume')


class OptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        # fields = ('id', 'contract_name', 'type', 'strike_price', 'bid_price', 'ask_price', 'expire_date')
        fields = '__all__'
        read_only_fields = ('company',)

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ('id', 'name', 'ticker')


class OptionCompanySerializer(serializers.ModelSerializer):
    company = serializers.PrimaryKeyRelatedField(queryset=Company.objects.all(), write_only=True)
    company_detail = serializers.HyperlinkedRelatedField(read_only=True, view_name='company-detail', source='company')
    class Meta:
        model = Option
        fields = ('id', 'contract_name', 'type', 'strike_price', 'bid_price', 'ask_price', 'expire_date', 'company', 'company_detail', 'to', 'pricing')

