from django.urls import path, include
from . import views

urlpatterns = [ 
    path("auth/", include("rest_framework.urls")),
    path("stocks/", views.StockList.as_view(), name='stock-list'),
    path("stocks/<str:ticker>", views.StockDetail.as_view(), name='stock-detail'),
    path("stocks/<str:ticker>/history", views.StockHistory.as_view(), name='stock-history'),
]