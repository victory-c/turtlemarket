from rest_framework import generics
from django.shortcuts import get_object_or_404
from .models import Stock, StockDay
from .serializers import StockSerializer, StockDaySerializer
from .permissions import IsAdminOrReadOnly

# Create your views here.
class StockDetail(generics.RetrieveUpdateDestroyAPIView):
  # Retrieve single stock 
  queryset = Stock.objects.all()
  serializer_class = StockSerializer
  lookup_field = 'ticker'

  permission_classes = [IsAdminOrReadOnly]

class StockList(generics.ListCreateAPIView):
  # List all stocks
  queryset = Stock.objects.all()
  serializer_class = StockSerializer

  permission_classes = [IsAdminOrReadOnly]

class StockHistory(generics.ListCreateAPIView):
  # List price history of single stock
  serializer_class = StockDaySerializer

  permission_classes = [IsAdminOrReadOnly]

  def get_queryset(self):
    ticker = self.kwargs.get('ticker')
    get_object_or_404(Stock, ticker=ticker)
    queryset = StockDay.objects.filter(stock__ticker=ticker)
    return queryset.order_by('-date')[:30]