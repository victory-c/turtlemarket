from rest_framework import generics
from api.models import Stock, StockDay
from api.serializers import StockSerializer, StockDaySerializer

# Create your views here.
class StockInfo(generics.RetrieveAPIView):
  # Retrieve single stock info
  queryset = Stock.objects.all()
  serializer_class = StockSerializer

class StockList(generics.ListAPIView):
  # View list of stocks
  queryset = Stock.objects.all()
  serializer_class = StockSerializer