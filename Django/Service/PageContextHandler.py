# Author  : <홍윤기> 
# Contact : <rain2473@naver.com>
# Date    : <2023-08-22>
from Service                                        import Crawler
from Service                                        import MarketMapMaker
from Service                                        import RealtimePrcieHandler

def indexPageContext():
    '''
    3가지 차트에 사용될 수집된 json을 원하는 Index page에서 사용하는 최종 형태로 내보내는 함수이다.
    
    [Returns]
        json(Dict<string, json>) : 지도 타입, 국내채권 구분, 해외 채권 구분
    '''

    market = Crawler.fetchJsonData("market")
    exchange = Crawler.fetchJsonData("exchange")

    Rates_KR = Crawler.fetchAPIJsonData("Rates_KR")
    KOSPI = Crawler.fetchAPIJsonData("KOSPI")
    Exchange_US = Crawler.fetchAPIJsonData("Exchange_US")

    Rates_US = Crawler.fetchAPIJsonData("Rates_US")
    DOWJONES = Crawler.fetchAPIJsonData("DOWJONES")
    NASDAQ = Crawler.fetchAPIJsonData("NASDAQ")
    
    return market, exchange, Rates_KR, KOSPI, Exchange_US, Rates_US, DOWJONES, NASDAQ

def bondsPageContext():
    '''
    2가지 차트에 사용될 수집된 json을 원하는 Bonds page에서 사용하는 최종 형태로 내보내는 함수이다.
    
    [Returns]
        json(Dict<string, json>) : 국내채권 구분, 해외 채권 구분
    '''

    Bonds = Crawler.fetchHtmlData('Bonds')

    KR1Y = Crawler.fetchAPIJsonData("KR1Y")
    KR3Y = Crawler.fetchAPIJsonData("KR3Y")
    KR5Y = Crawler.fetchAPIJsonData("KR5Y")
    KR10Y = Crawler.fetchAPIJsonData("KR10Y")

    US10YY = Crawler.fetchAPIJsonData("US10YY")
    GM10YY = Crawler.fetchAPIJsonData("GM10YY")
    UK10YY = Crawler.fetchAPIJsonData("UK10YY")
    JP10YY = Crawler.fetchAPIJsonData("JP10YY")
    
    return Bonds, KR1Y, KR3Y, KR5Y, KR10Y, US10YY, GM10YY, UK10YY, JP10YY

def marketMapPageContext(type):
    '''
    MarketMap page에서 사용하는 차트를 최종 형태로 내보내는 함수이다.
    
    [Returns]
        json(Dict<string, json>) : 국내채권 구분, 해외 채권 구분
    '''

    marketMap = MarketMapMaker.getMarketMap(type)

    return marketMap

def nationalPageContext():
    '''
    표에 사용될 HTML을 원하는 Foreignal page에서 사용하는 최종 형태로 내보내는 함수이다.
    
    [Returns]
        json(Dict<string, json>) : 국내채권 구분, 해외 채권 구분
    '''

    National = Crawler.fetchHtmlData('National')

    KOSPI = Crawler.fetchAPIJsonData("KOSPI")
    KOSDAQ = Crawler.fetchAPIJsonData("KOSDAQ")

    return National, KOSPI, KOSDAQ

def foreignalPageContext():
    '''
    표에 사용될 HTML을 원하는 Foreignal page에서 사용하는 최종 형태로 내보내는 함수이다.
    
    [Returns]
        json(Dict<string, json>) : 국내채권 구분, 해외 채권 구분
    '''

    Foreignal = Crawler.fetchHtmlData('Foreignal')

    DOWJONES = Crawler.fetchAPIJsonData("DOWJONES")
    NASDAQ = Crawler.fetchAPIJsonData("NASDAQ")
    STOXX = Crawler.fetchAPIJsonData("STOXX")
    DAX = Crawler.fetchAPIJsonData("DAX")
    NIKKEI = Crawler.fetchAPIJsonData("NIKKEI")
    STI = Crawler.fetchAPIJsonData("STI")
    HANGSENG = Crawler.fetchAPIJsonData("HANGSENG")
    SHCOMP = Crawler.fetchAPIJsonData("SHCOMP")

    return Foreignal, DOWJONES, NASDAQ, STOXX, DAX, NIKKEI, STI, HANGSENG, SHCOMP

def commoditiesPageContext():
    '''
    표에 사용될 HTML을 원하는 Commodities page에서 사용하는 최종 형태로 내보내는 함수이다.
    
    [Returns]
        json(Dict<string, json>) : 국내채권 구분, 해외 채권 구분
    '''

    Commodities = Crawler.fetchHtmlData('Commodities')

    WTI = Crawler.fetchAPIJsonData("WTI")
    DUBAI = Crawler.fetchAPIJsonData("DUBAI")
    BRENT = Crawler.fetchAPIJsonData("BRENT")
    GOLD = Crawler.fetchAPIJsonData("GOLD")
    COPPER = Crawler.fetchAPIJsonData("COPPER")
    ALUMINUM = Crawler.fetchAPIJsonData("ALUMINUM")
    NICKEL = Crawler.fetchAPIJsonData("NICKEL")
    ZINC = Crawler.fetchAPIJsonData("ZINC")
    CORN = Crawler.fetchAPIJsonData("CORN")
    WHEAT = Crawler.fetchAPIJsonData("WHEAT")
    SOYBEAN = Crawler.fetchAPIJsonData("SOYBEAN")
    COTTON = Crawler.fetchAPIJsonData("COTTON")

    return Commodities, WTI, DUBAI, BRENT, GOLD, COPPER, ALUMINUM, NICKEL, ZINC, CORN, WHEAT, SOYBEAN, COTTON

def apiPricesPageContext(isin):
    '''
    api로서 요청받는 실시간 호가창을 내보내는 함수이다.
    
    [Returns]
        호가창의 div 객체
    '''

    prices = RealtimePrcieHandler.getRealtimePrice(isin)

    return prices
