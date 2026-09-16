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
                regex=r'\A[A-Z]{1,5}\Z',
                message='Ticker must be uppercase and at most 5 characters.',
            )
        ],
    )
    name = models.CharField(max_length=100)

    def clean(self):
        if self.name is None or not self.name.strip():
            raise ValidationError({'name': 'Name cannot be empty.'})

    def save(self, *args, **kwargs):
        self.full_clean()
        return super().save(*args, **kwargs)

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
        constraints = [
            models.CheckConstraint(condition=models.Q(open_price__gte=Decimal('0.01')), name='stockday_open_price_gte_001'),
            models.CheckConstraint(condition=models.Q(close_price__gte=Decimal('0.01')), name='stockday_close_price_gte_001'),
            models.CheckConstraint(condition=models.Q(high_price__gte=Decimal('0.01')), name='stockday_high_price_gte_001'),
            models.CheckConstraint(condition=models.Q(low_price__gte=Decimal('0.01')), name='stockday_low_price_gte_001'),
            models.CheckConstraint(condition=models.Q(volume__gte=1), name='stockday_volume_gte_1'),
        ]
        ordering = ['-date']
    
    def __str__(self):
        return f"{self.stock.ticker} | {self.date} | {self.close_price}"