from django.db import models
from django.core.validators import MinValueValidator, RegexValidator
from django.core.exceptions import ValidationError
from decimal import Decimal

# Create your models here.
class Stock(models.Model):
    ticker = models.CharField(
        max_length=5,
        validators=[
            RegexValidator(
                regex=r'^[A-Z]{1,5}$',
                message='Ticker must be uppercase and at most 5 characters.',
            )
        ],
    )
    name = models.CharField(max_length=100)

    def clean(self):
        if not self.name.strip():
            raise ValidationError({'name': 'Name cannot be empty.'})

    def __str__(self):
        return f"{self.ticker} | {self.name}"

class StockDay(models.Model):
    date = models.DateField(auto_now_add=True)
    stock = models.ForeignKey(Stock, on_delete=models.CASCADE, related_name='prices')

    open_price = models.DecimalField(max_digits=15, decimal_places=2, validators=[MinValueValidator(Decimal('0.01'))])
    close_price = models.DecimalField(max_digits=15, decimal_places=2, validators=[MinValueValidator(Decimal('0.01'))])
    high_price = models.DecimalField(max_digits=15, decimal_places=2, validators=[MinValueValidator(Decimal('0.01'))])
    low_price = models.DecimalField(max_digits=15, decimal_places=2, validators=[MinValueValidator(Decimal('0.01'))])
    volume = models.BigIntegerField(validators=[MinValueValidator(1)])

    class Meta:
        unique_together = ('stock', 'date')
        indexes = [
            models.Index(fields=['stock', '-date']), 
            models.Index(fields=['date']),
        ]
        ordering = ['-date']
    
    def __str__(self):
        return f"{self.stock.ticker} | {self.date} | {self.close_price}"