from django.urls import path
from . import views

urlpatterns = [ 
    path("stocks/", views.StockList.as_view()),
    path("stocks/<int:pk>", views.StockInfo.as_view())
]