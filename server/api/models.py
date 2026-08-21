from django.db import models

# Create your models here.
class Stock(models.Model):
    ticker = models.CharField(max_length=5)
    name = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.ticker} | {self.name}"

class StockDay(models.Model):
    date = models.DateField(auto_now_add=True)
    stock = models.ForeignKey(Stock, on_delete=models.CASCADE, related_name='prices')

    openPrice = models.DecimalField(max_digits=15, decimal_places=2)
    closePrice = models.DecimalField(max_digits=15, decimal_places=2)
    highPrice = models.DecimalField(max_digits=15, decimal_places=2)
    lowPrice = models.DecimalField(max_digits=15, decimal_places=2)
    volume = models.BigIntegerField()

    class Meta:
        unique_together = ('stock', 'date')
        indexes = [
            models.Index(fields=['stock', '-date']), 
            models.Index(fields=['date']),
        ]
        ordering = ['-date']
    
    def __str__(self):
        return f"{self.stock.symbol} | {self.date} | {self.closePrice}"