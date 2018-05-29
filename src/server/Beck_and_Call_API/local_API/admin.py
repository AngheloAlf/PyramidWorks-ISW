from django.contrib import admin
from .models import Company, Stock, Option
# Register your models here.
admin.site.register(Company)
admin.site.register(Stock)
admin.site.register(Option)