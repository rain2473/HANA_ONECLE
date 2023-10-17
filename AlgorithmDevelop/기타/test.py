from newsModel import newsCrawler
from DB import DataFrameHandler

stocks = DataFrameHandler.findItems("stock", columns=['ISIN'])['ISIN'].to_list()
for i, stock in enumerate(stocks):
    df = newsCrawler.getNewsData(stock, "2023/09/01")
    # if df.empty or i <= 285:
    #     print(f'{stock} 종목 성공 : {i}개 종목 완료')
    #     continue
    DataFrameHandler.insertItems('NEWS', df)
    print(f'{stock} 종목 성공 : {i}개 종목 완료')