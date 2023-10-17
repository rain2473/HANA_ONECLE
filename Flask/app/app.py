from pykrx import stock
from newsModel import newsCrawler
from DB import DataFrameHandler
from DB import AIModelHandler
from flask import Flask
from flask_restx import Api, Resource

import requests, os, pickle, datetime
import pandas as pd
import urllib3
import json
import pandas as pd
import re

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
pd.options.mode.chained_assignment = None

def getBenchmark(idx):
    idxCode = {"KOSPI":1, "KOSDAQ":2, "RATE":3}
    if idx.upper() in idxCode.keys():
        benchmark = DataFrameHandler.findItems('Daily_Index', condition=f"IDX_CODE={idxCode[idx.upper()]}", orderBy='WORK_DT')
        benchmark= benchmark[['WORK_DT','VALUE']].reset_index(drop=True)
    return benchmark

def calcStochasticK(df, n=14):
    Numerator = df - df.rolling(window=n).min()
    Denominator = df.rolling(window=n).max() - df.rolling(window=n).min()
    result = (Numerator / Denominator * 100).round()
    return result

def makeStatisticsDF(ticker):
    tmp = DataFrameHandler.findItems("ohlcv", condition=f"ISIN = '{ticker}' and WORK_DT > TO_DATE('2023/01/01','YYYY/MM/DD')")
    tmp = tmp.sort_values('WORK_DT').reset_index(drop=True)
    tmp.drop(columns=['OPEN','HIGH','LOW',"AMOUNT",'UPDOWN'], inplace=True)
    tmp['PRICE_CHANGE'] = tmp['CLOSE'].diff().fillna(0)
    tmp['MOMENTUM'] = (tmp['CLOSE'] - tmp['CLOSE'].shift(10)).fillna(0)
    tmp['OBV'] = ((tmp['PRICE_CHANGE'] != 0) * ((tmp['PRICE_CHANGE'] > 0) * 2 - 1) * tmp['VOLUME']).cumsum()
    tmp['STOCHASTIC_K'] = calcStochasticK(tmp['CLOSE'])
    tmp['STOCHASTIC_D'] = tmp['STOCHASTIC_K'].rolling(window=3).mean()
    tmp['GAIN'] = tmp['PRICE_CHANGE'].apply(lambda x: max(x, 0))
    tmp['LOSS'] = tmp['PRICE_CHANGE'].apply(lambda x: -min(x, 0))
    tmp['EMA_GAIN'] = tmp['GAIN'].ewm(span=10, min_periods=10).mean()
    tmp['EMA_LOSS'] = tmp['LOSS'].ewm(span=10, min_periods=10).mean()
    tmp['RS'] = tmp['EMA_GAIN'] / tmp['EMA_LOSS']
    tmp['RSI'] = 100 - (100 / (1 + tmp['RS']))
    tmp.drop(columns=['CLOSE', 'VOLUME', 'PRICE_CHANGE', 'GAIN', 'LOSS', 'EMA_GAIN', 'EMA_LOSS','RS'], inplace=True)
    tmp = tmp.round().dropna().reset_index(drop=True)
    return tmp

def labelDate():
    df = stock.get_market_ohlcv('20230101', "20240101", '005930').reset_index().rename(columns={'날짜':'WORK_DT'})
    tmp1 = df[['WORK_DT']]
    tmp2 = DataFrameHandler.findItems("WORK_DATE")
    result = tmp1[~tmp1["WORK_DT"].isin(tmp2["WORK_DT"])].reset_index(drop=True)
    result['DATE_LABEL'] = tmp2['DATE_LABEL'].max() + result.index + 1
    input = result.copy(deep=True)
    DataFrameHandler.insertItems('WORK_DATE', input)
    return result

def preprocessing2(ohlcv, fundamental, dateDF, fundamental_columns):
    tmp_ohlcv = ohlcv.drop(columns=['AMOUNT'])
    if fundamental_columns:
        try:
            tmp_fundamental = fundamental[["ISIN","WORK_DT", 'PBR','PER']]
            total = pd.merge(tmp_ohlcv, tmp_fundamental, how='outer')
            total.dropna(axis=0, inplace=True)
        except:
            total = tmp_ohlcv
    else:
        total = tmp_ohlcv
    total.drop(columns=["ISIN"], inplace=True)
    total['WORK_DT'] = dateDF['DATE_LABEL']
    return total

def callTargetDataFrame(isin, date, fundamental_columns):
    if DataFrameHandler.findItems('stock', columns='count(*)', condition=f"ISIN='{isin}'")['COUNT(*)'].to_list()[0] != 1:
        raise Exception("ISIN NOT EXIST")
    dateDF = DataFrameHandler.findItems('WORK_DATE', condition=f"WORK_DT >= to_date('{date}', 'YYYY/MM/DD')")
    ohlcv = DataFrameHandler.findItems('ohlcv', condition=f"ISIN='{isin}' and WORK_DT >= to_date('{date}', 'YYYY/MM/DD')", orderBy='WORK_DT')
    fundamental = DataFrameHandler.findItems('fundamental', condition=f"ISIN='{isin}' and WORK_DT >= to_date('{date}', 'YYYY/MM/DD')", orderBy='WORK_DT')
    result = preprocessing2(ohlcv, fundamental, dateDF, fundamental_columns)
    return {"result" : result, "date" : dateDF}

def callAIModels(isin):
    if DataFrameHandler.findItems('stock', columns='count(*)', condition=f"ISIN='{isin}'")['COUNT(*)'].to_list()[0] != 1:
        raise Exception("ISIN NOT EXIST")
    mainDirectory = os.path.join('PredictModel', 'models')
    subDirectory = os.path.join(mainDirectory, isin)
    fileDirectory = os.path.join(subDirectory, 'lastest.sav')
    with open(fileDirectory, 'rb') as file:
        models = file.read()
    models = pickle.loads(models)
    model_info = DataFrameHandler.findItems('MODEL_MANAGE', condition=f"ISIN='{isin}'", orderBy='VER_ID', desc=True)
    models['version'] = model_info['VER_ID'][0]
    return models

def predict(isin, date, models):
    datas = callTargetDataFrame(isin, date, models['fundamental_columns'])
    dates = datas['date']
    dataFrame = datas['result']
    priceModel = models['priceModel']
    updownModel = models['updownModel']
    updownPredict = updownModel.predict(dataFrame)
    try: 
        pricePredict = priceModel.predict(dataFrame)
    except:
        pricePredict = updownPredict
    result = pd.DataFrame({"PREDICT_PRICE" : pricePredict, "PREDICT_UPDOWN" : updownPredict})
    dataFrame['WORK_DT'] = dates['WORK_DT']
    dataFrame['ISIN'] = isin
    result = pd.concat([dataFrame, result], axis=1)
    result['VER_ID'] = models['version']
    result['PREDICT_PRICE'] = (result['PREDICT_PRICE'] > result['CLOSE']) * 1
    result['PREDICT_UPDOWN'] = (result['PREDICT_UPDOWN'].round(2) > 0.5) * 1
    return result

def makePrediction(isin, date):
    Model = callAIModels(isin)
    df = callTargetDataFrame(isin, date, fundamental_columns = Model['fundamental_columns'])
    df['result']['ANSWER'] = (df['result']['UPDOWN'].shift(-1) > 0) * 1
    df['result']["WORK_DT"] = df['date']["WORK_DT"]
    prediction = pd.merge(predict(isin, date, Model), df['result'][["WORK_DT",'ANSWER']], how='outer')
    prediction['CORRECT_PRICE'] = (prediction['PREDICT_PRICE'] == prediction['ANSWER']) * 1
    prediction['CORRECT_UPDOWN'] = (prediction['PREDICT_UPDOWN'] == prediction['ANSWER']) * 1
    prediction['WORK_DT'] = pd.to_datetime(prediction['WORK_DT'])
    prediction = prediction[["ISIN", "WORK_DT", 'VER_ID', "PREDICT_PRICE", "PREDICT_UPDOWN", "CORRECT_PRICE", "CORRECT_UPDOWN"]]
    return prediction
    
def getIndex():
    kosdaq_url = f'http://ecos.bok.or.kr/api/StatisticSearch/A5P1FVP5VX625OV2NVTA/json/kr/1/100000/802Y001/D/20130101/20240101/0089000'
    rate_url = f'http://ecos.bok.or.kr/api/StatisticSearch/A5P1FVP5VX625OV2NVTA/json/kr/1/100000/722Y001/D/20130101/20240101/0101000'
    kospi_url = f'http://ecos.bok.or.kr/api/StatisticSearch/A5P1FVP5VX625OV2NVTA/json/kr/1/100000/802Y001/D/20130101/20240101/0001000'
    url = {
        'kosdaq_url' : kosdaq_url,
        'rate_url' : rate_url,
        'kospi_url' : kospi_url
    }
    code = {
        'kospi_url' : 1,
        'kosdaq_url' : 2,
        'rate_url' : 3
    }
    result = pd.DataFrame([])
    for input in ['kospi_url', 'kosdaq_url', 'rate_url']:
        response = requests.get(url[input], verify=False)
        value = []
        time = []
        if response.status_code == 200:
            data = response.json()
            IDX_CODE = [code[input]] * data['StatisticSearch']['list_total_count']
            for i in range(data['StatisticSearch']['list_total_count']):
                value.append(data['StatisticSearch']['row'][i]['DATA_VALUE'])
                time.append(data['StatisticSearch']['row'][i]['TIME'])
            
            tmp = pd.DataFrame({'WORK_DT' : time, 'IDX_CODE' : IDX_CODE, 'VALUE' : value})
            result = pd.concat([result, tmp])
        else:
            print(f"Failed to fetch data from {url}. Status code: {response.status_code}")
            result = None

    result['WORK_DT'] = result['WORK_DT'].str[:4] + '-' + result['WORK_DT'].str[4:6] + '-' + result['WORK_DT'].str[6:8]
    result['WORK_DT'] = pd.to_datetime(result['WORK_DT'], format='%Y-%m-%d')
    return result

def calcNewsScore(isin, start = '2023/09/01', end = None):
    news = pd.DataFrame([])
    work_dts = AIModelHandler.selectWorkDates(start = start)
    for work_dt in work_dts:
        work_dt = work_dt.date()
        news = pd.concat([news, AIModelHandler.getNewsScore(isin, work_dt)])
    news = news[['ISIN', 'WORK_DT', 'MENTION_SCORE', 'POSITIVE_SCORE']]
    news.fillna(0, inplace=True)
    news['WORK_DT'] = news['WORK_DT'].astype('datetime64[ns]')
    news['POSITIVE_SCORE'] = ((news['POSITIVE_SCORE'] + 100) / 2).round().astype('int')
    return news

def calcPredictScore(isin, start = '2023/09/01', end = None):
    return DataFrameHandler.findItems('predict', columns=["isin, work_dt, PREDICT_PRICE * 10 as price_score, PREDICT_UPDOWN * 10  as updown_score"], condition=f"isin = '{isin}' and work_dt >= TO_DATE('{start}', 'YYYY/MM/DD')")

def calcStatisticsScore(isin, start = '2023/09/01', end = None):
    statistics = DataFrameHandler.findItems('statistics', condition=f"isin = '{isin}' and work_dt >= (SELECT TO_DATE('{start}', 'YYYY/MM/DD') - 20 AS WORK_DT FROM DUAL)")
    statistics['RSI_SCORE'] = calcStochasticK(statistics['RSI'])
    statistics['OBV_SCORE'] = calcStochasticK(statistics['OBV'])
    statistics['STOCHASTIC_SCORE'] = calcStochasticK(statistics['STOCHASTIC_D'])
    statistics['MOMENTUM_SCORE'] = calcStochasticK(statistics['MOMENTUM'])
    statistics = statistics[statistics['WORK_DT']>='2023/09/01'][['ISIN', 'WORK_DT', 'RSI_SCORE', 'OBV_SCORE', 'STOCHASTIC_SCORE', 'MOMENTUM_SCORE']]
    statistics.fillna(0, inplace=True)
    statistics['RSI_SCORE'] = statistics['RSI_SCORE'].astype(int)
    statistics['OBV_SCORE'] = statistics['OBV_SCORE'].astype(int)
    statistics['STOCHASTIC_SCORE'] = statistics['STOCHASTIC_SCORE'].astype(int)
    statistics['MOMENTUM_SCORE'] = statistics['MOMENTUM_SCORE'].astype(int)
    return statistics

def calcScore(isin, start = '2023/09/01', end = None):
    predict = calcPredictScore(isin, start = start, end = end)
    statistics = calcStatisticsScore(isin, start = start, end = end)
    news = calcNewsScore(isin, start = start, end = end)
    result = pd.merge(pd.merge(news, predict, how='outer'), statistics, how='outer') 
    result['AI_SCORE'] = (result[['PRICE_SCORE', 'UPDOWN_SCORE', 'MENTION_SCORE', 'POSITIVE_SCORE']].sum(axis=1) / 220 * 100)
    result['STATISTICS_SCORE'] = (result[['RSI_SCORE', 'OBV_SCORE', 'STOCHASTIC_SCORE', 'MOMENTUM_SCORE']].sum(axis=1) / 400 * 100)
    result['TOTAL_SCORE'] = (result[['PRICE_SCORE', 'UPDOWN_SCORE', 'MENTION_SCORE', 'POSITIVE_SCORE', 'RSI_SCORE', 'OBV_SCORE', 'STOCHASTIC_SCORE', 'MOMENTUM_SCORE']].sum(axis=1) / 620 * 100)
    result = result.round().astype({'AI_SCORE': 'int', 'STATISTICS_SCORE': 'int', 'TOTAL_SCORE': 'int'})
    return result

app = Flask(__name__)
api = Api(app)

# ---------------------------------------------------------------------------------------------------------------------#
def updateWorkDate():
    tickers = AIModelHandler.selectAllStock()
    work_date = labelDate()
    return tickers, work_date

def updateDailyIndex(work_date):
    daily_index = getIndex()
    daily_index = daily_index[daily_index["WORK_DT"].isin(work_date['WORK_DT'])]
    DataFrameHandler.insertItems('daily_index', daily_index)

def updateStockInfo(tickers, work_date):
    failed = []
    result_ohlcv = pd.DataFrame([])
    result_fundamental = pd.DataFrame([])
    for  work_dt in work_date['WORK_DT'].dt.strftime("%Y%m%d").to_list():
        try:
            ohlcv1 = stock.get_market_ohlcv(work_dt)
            fundamental1 = stock.get_market_fundamental(work_dt)
            ohlcv2 = stock.get_market_ohlcv(work_dt, market = "KOSDAQ")
            fundamental2 = stock.get_market_fundamental(work_dt, market = "KOSDAQ")
            ohlcv = pd.concat([ohlcv1, ohlcv2]).reset_index()
            fundamental = pd.concat([fundamental1, fundamental2]).reset_index()
            ohlcv['WORK_DT'] = pd.to_datetime(work_dt)
            fundamental['WORK_DT'] = pd.to_datetime(work_dt)
            ohlcv = ohlcv[ohlcv['티커'].isin(tickers)]
            fundamental = fundamental[fundamental['티커'].isin(tickers)]
            ohlcv = ohlcv.rename(columns={'티커':'ISIN', '시가':'OPEN', '고가':'HIGH', '저가':'LOW', '종가':'CLOSE', '거래량':'VOLUME', '거래대금':'AMOUNT', '등락률':'UPDOWN'})
            fundamental = fundamental.rename(columns={'티커':'ISIN'})
            result_ohlcv = pd.concat([result_ohlcv, ohlcv])
            result_fundamental = pd.concat([result_fundamental, fundamental])
        except Exception as e:
            print(e)
            failed.append(work_dt)

    DataFrameHandler.insertItems('OHLCV', result_ohlcv)
    DataFrameHandler.insertItems('FUNDAMENTAL', result_fundamental)

def updatePredictionAndStatistics(tickers, work_date):
    failed = []
    result_statistics = pd.DataFrame([])
    result_prediction = pd.DataFrame([])

    for i, ticker in enumerate(tickers):
        try:
            statistics = makeStatisticsDF(ticker)
            statistics = statistics[statistics["WORK_DT"].isin(work_date['WORK_DT'])]
            prediction = makePrediction(ticker, '2023/10/05')

            result_statistics = pd.concat([result_statistics, statistics])
            result_prediction = pd.concat([result_prediction, prediction])

        except Exception as e:
            print(e)
            failed.append(ticker)
    input_statistics = result_statistics.copy(deep=True)
    input_prediction = result_prediction.copy(deep=True)
    DataFrameHandler.insertItems('tmp_statistics', input_statistics)
    DataFrameHandler.mergeTable('statistics', 'tmp_statistics', ["ISIN", "WORK_DT"])
    DataFrameHandler.insertItems('tmp_predict', input_prediction)
    DataFrameHandler.mergeTable('predict', 'tmp_predict', ["ISIN", "WORK_DT"])

def updateNewsNLP(tickers, work_date):
    failed = []
    result_news = pd.DataFrame([])

    for i, ticker in enumerate(tickers):
        try:
            news = newsCrawler.getNewsData(ticker, "2023/10/10")

            result_news = pd.concat([result_news, news])

        except Exception as e:
            print(e)
            failed.append(ticker)

    input_news = result_news.copy(deep=True)
    DataFrameHandler.insertItems('tmp_news', input_news)
    DataFrameHandler.mergeTable('news', 'tmp_news', ["ISIN", "NEWS_ID"])

def updateOncleScore(tickers, work_date):
    failed = []
    result_score = pd.DataFrame([])
    for i, ticker in enumerate(tickers):
        try:
            score = calcScore(ticker, start = '2023/09/20')
            score = score[score["WORK_DT"].isin(work_date['WORK_DT'])]
            result_score = pd.concat([result_score, score])

        except Exception as e:
            print(e)
            failed.append(ticker)

    result_score.dropna(inplace=True)
    input_score = result_score.copy(deep=True)
    DataFrameHandler.insertItems("tmp_ONECLE_SCORE", input_score)
    DataFrameHandler.mergeTable('ONECLE_SCORE', 'tmp_ONECLE_SCORE', ["ISIN", "WORK_DT"])

def updatePorfolio():
    workDate = DataFrameHandler.findItems('work_date', condition="work_dt >= to_date('2023/09/01','yyyy/mm/dd')", orderBy= 'date_label')
    orderRequest = DataFrameHandler.findItems('order_request', columns=['odr_id','acc_id','isin','work_dt','order_price','order_volume', 'order_type', 'order_result'], condition="acc_id = (select acc_id from account where one_id = 'hoomba1234')", orderBy="odr_id")
    stocks = orderRequest['ISIN'].unique()
    stockString = "'" + "', '".join(stocks) + "'"
    ohlcv = DataFrameHandler.findItems('ohlcv', columns = ['ISIN', 'WORK_DT', 'CLOSE'], condition=f"work_dt >= to_date('2023/09/01','yyyy/mm/dd') and ISIN in ({stockString})", orderBy="WORK_DT")
    values = pd.DataFrame([])
    for ticker in stocks:
        stock = orderRequest[orderRequest['ISIN'] == ticker]
        stock['VOLUME_CHANGE'] = stock['ORDER_VOLUME'] * (stock['ORDER_TYPE'] * -2 + 1)
        stock = stock.groupby('WORK_DT').agg({'VOLUME_CHANGE': 'sum'}).reset_index()
        stock = pd.merge(workDate, stock, how='outer')
        stock['VOLUME_CHANGE'].fillna(0, inplace=True)
        stock["BALANCE_VOLUME"] = stock['VOLUME_CHANGE'].cumsum()
        stock = stock[['WORK_DT', 'BALANCE_VOLUME']]
        stock = pd.merge(stock, ohlcv[ohlcv['ISIN'] == ticker], how='inner')
        stock['VALUE'] = stock['BALANCE_VOLUME'] * stock['CLOSE']
        stock = stock[['WORK_DT', 'ISIN','VALUE']]
        values = pd.concat([values, stock])
    values = values.groupby('WORK_DT').agg({'VALUE': 'sum'}).reset_index()
    sellRequest = orderRequest[orderRequest['ORDER_TYPE']==1]
    sellRequest['SELL_ORDER_AMOUNT'] = sellRequest['ORDER_PRICE'] * sellRequest['ORDER_VOLUME']
    sellRequest = sellRequest.groupby('WORK_DT').agg({'SELL_ORDER_AMOUNT': 'sum'}).reset_index()
    sellRequest = pd.merge(workDate, sellRequest, how='outer')
    sellRequest['SELL_ORDER_AMOUNT'].fillna(0, inplace=True)
    sellRequest['SELL_AMOUNT'] = sellRequest['SELL_ORDER_AMOUNT'].cumsum()
    buyRequest = orderRequest[orderRequest['ORDER_TYPE']==0]
    buyRequest['BUY_ORDER_AMOUNT'] = buyRequest['ORDER_PRICE'] * buyRequest['ORDER_VOLUME']
    buyRequest = buyRequest.groupby('WORK_DT').agg({'BUY_ORDER_AMOUNT': 'sum'}).reset_index()
    buyRequest = pd.merge(workDate, buyRequest, how='outer')
    buyRequest['BUY_ORDER_AMOUNT'].fillna(0, inplace=True)
    buyRequest['BUY_AMOUNT'] = buyRequest['BUY_ORDER_AMOUNT'].cumsum()
    portfolio = buyRequest[['WORK_DT']]
    portfolio[['SELL_ORDER_AMOUNT', 'PROFIT']] = sellRequest[['SELL_ORDER_AMOUNT', 'SELL_AMOUNT']]
    portfolio[['BUY_ORDER_AMOUNT', 'BUY_AMOUNT']] = buyRequest[['BUY_ORDER_AMOUNT', 'BUY_AMOUNT']]
    portfolio['ACC_ID'] = orderRequest['ACC_ID'][0]
    portfolio['VALUE_AMOUNT'] = values['VALUE']
    portfolio = portfolio[['ACC_ID', 'WORK_DT', 'BUY_AMOUNT', 'VALUE_AMOUNT', 'PROFIT']]
    DataFrameHandler.insertItems('portfolio', portfolio)

@api.route("/update/portfolio")
class updatePorfolio(Resource):
    def get(self): 
        try:
            updatePorfolio()
            return pd.DataFrame([{"성":"공"}]).to_json(orient="records")
        except:
            return pd.DataFrame([{"망":"함"}]).to_json(orient="records")
        
@api.route("/update/stock_infos")
class StockInfos(Resource):
    def get(self): 
        try:
            tickers, work_date = updateWorkDate()
            updateDailyIndex(work_date)
            updateStockInfo(tickers, work_date)
            updatePredictionAndStatistics(tickers, work_date)
            updateNewsNLP(tickers, work_date)
            updateOncleScore(tickers, work_date)
            updatePorfolio()
            return pd.DataFrame([{"성":"공"}]).to_json(orient="records")
        except:
            return pd.DataFrame([]).to_json(orient="records")

if __name__ == "__main__":
    app.debug = True
    app.run(debug=True, host='0.0.0.0', port=2473)
