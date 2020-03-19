from django.urls import path

from . import views

urlpatterns = [
    path('av_api_key', views.av_api_key, name='av_api_key'),
    path('search_stock', views.search_stock, name='search_stock'),

    path('daily_data/stock_price_plot', views.search_stock, name='search_stock'),

]