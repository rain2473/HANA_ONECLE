from django.http import HttpResponse
from django.shortcuts import render
from Service import PageContextHandler

def test(request):
    return render(request, 'dataCenter/test.html')

def index(request):
    market, exchange, Rates_KR, KOSPI, Exchange_US, Rates_US, DOWJONES, NASDAQ = PageContextHandler.indexPageContext()
    return render(request, 'dataCenter/index.html', context={"market" : market, "exchange" : exchange, "Rates_KR" : Rates_KR, "KOSPI" : KOSPI, "Exchange_US" : Exchange_US, "Rates_US" : Rates_US, "DOWJONES" : DOWJONES, "NASDAQ" : NASDAQ})

def KoreaMarketMap(request, type):
    fig_div, date, status = PageContextHandler.marketMapPageContext(type)
    return render(request, 'dataCenter/KoreaMarketMap.html',context={'fig_div': fig_div, "created_time" : date, "status" : status, "type" : type})

def National(request):
    list_div, KOSPI, KOSDAQ = PageContextHandler.nationalPageContext()
    return render(request, 'dataCenter/national.html', context={"list_div" : list_div, "KOSPI" : KOSPI, "KOSDAQ" : KOSDAQ})

def Foreignal(request):
    list_div, DOWJONES, NASDAQ, STOXX, DAX, NIKKEI, STI, HANGSENG, SHCOMP = PageContextHandler.foreignalPageContext()
    return render(request, 'dataCenter/foreignal.html', context={'list_div': list_div, "DOWJONES" : DOWJONES, "NASDAQ" : NASDAQ, "STOXX" : STOXX, "DAX" : DAX, "NIKKEI" : NIKKEI, "STI" : STI, "HANGSENG" : HANGSENG, "SHCOMP" : SHCOMP})

def Commodities(request):
    list_div, WTI, DUBAI, BRENT, GOLD, COPPER, ALUMINUM, NICKEL, ZINC, CORN, WHEAT, SOYBEAN, COTTON = PageContextHandler.commoditiesPageContext()
    return render(request, 'dataCenter/commodities.html', context={'list_div': list_div, "WTI" : WTI, "DUBAI" : DUBAI, "BRENT" : BRENT, "GOLD" : GOLD, "COPPER" : COPPER, "ALUMINUM" : ALUMINUM, "NICKEL" : NICKEL, "ZINC" : ZINC, "CORN" : CORN, "WHEAT" : WHEAT, "SOYBEAN" : SOYBEAN, "COTTON" : COTTON})

def Bonds(request):
    list_div, KR1Y, KR3Y, KR5Y, KR10Y, US10YY, GM10YY, UK10YY, JP10YY = PageContextHandler.bondsPageContext()
    return render(request, 'dataCenter/bonds.html', context={'list_div': list_div, "KR1Y" : KR1Y, "KR3Y" : KR3Y, "KR5Y" : KR5Y, "KR10Y" : KR10Y, "US10YY" : US10YY, "GM10YY" : GM10YY, "UK10YY" : UK10YY, "JP10YY" : JP10YY})

def Prices(request, isin):
    div = PageContextHandler.apiPricesPageContext(isin)
    return render(request, 'dataCenter/prices.html',context={'div': div})