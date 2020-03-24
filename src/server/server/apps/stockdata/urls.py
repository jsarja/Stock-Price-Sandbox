from django.urls import path

from . import views

urlpatterns = [
    path('av_api_key', views.av_api_key, name='av_api_key'),
    path('search_stock', views.search_stock, name='search_stock'),

    path('latest_daily/stock_price_plot', views.stock_data_latest_daily, name='stock_data_latest_daily'),
    path('long_term/stock_price_plot', views.stock_data_long_term, name='stock_price_plot'),

]