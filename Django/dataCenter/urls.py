from django.urls import path
from .views import *

app_name = 'dataCenter'
urlpatterns = [
    path('', index, name='index'),
    path('test/', test, name='test'),
    path('KoreaMarketMap/<str:type>', KoreaMarketMap, name='KoreaMarketMap'),
    path('foreignal/', Foreignal, name='foreignal'),
    path('national/', National, name='national'),
    path('commodities/', Commodities, name='commodities'),
    path('bonds/', Bonds, name='bonds'),
    path('api/prices/<str:isin>', Prices, name='prices'),
]