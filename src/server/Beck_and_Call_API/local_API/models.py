from django.db import models

# Create your models here.
class Company(models.Model):
    name = models.CharField(max_length=50)
    ticker = models.SlugField(max_length=10)

    def __str__(self):
        return self.name


class Option(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE)

    contract_name = models.CharField(max_length=100)
    type = models.BooleanField()
    strike_price = models.DecimalField(max_digits=12, decimal_places=2)
    bid_price = models.DecimalField(max_digits=12, decimal_places=2)
    ask_price = models.DecimalField(max_digits=12, decimal_places=2)
    expire_date = models.DateField()

    def __str__(self):
        return self.contract_name

class Stock(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE)

    date = models.DateField()
    open_price = models.DecimalField(max_digits=12, decimal_places=2)
