from rest_framework import serializers
from api.models import Stock, StockDay

class StockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stock
        fields = ["id", "ticker", "name"]

class StockDaySerializer(serializers.ModelSerializer):
    class Meta:
        model = StockDay
        fields = ["id", "date", "stock", "openPrice", "closePrice", "highPrice", "lowPrice", "volume"]