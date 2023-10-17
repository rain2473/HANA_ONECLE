from . import DataFrameHandler
import pandas as pd

def selectNoDataStock():
    queryString = f"""
        select * from
        (select stock.isin, stock.name, nvl(a.count,0) as COUNT
        from stock,
        (select isin, count(isin) as count from ohlcv group by isin) a
        where stock.isin = a.isin(+))
        where count = 0
    """
    return DataFrameHandler.returnDF(queryString)

def selectAllStock(returnType="LIST"):
    queryString = f"""
        select isin from stock order by market_code, isin asc
    """
    result = DataFrameHandler.returnDF(queryString)
    if returnType.upper() != "DF":
        result = list(result['ISIN'])
    return result

def selectWorkDates(returnType="LIST", start = None, end = None):
    queryString = f"""
        select work_dt from work_date
    """
    if start != None:
        queryString += f"where work_dt >= TO_DATE('{start}', 'YYYY/MM/DD')"
        if end != None:
            queryString += f"and work_dt <= TO_DATE('{end}', 'YYYY/MM/DD')"
    elif end != None:
        queryString += f"where work_dt <= TO_DATE('{end}', 'YYYY/MM/DD')"
    
    queryString += " order by date_label asc"
    result = DataFrameHandler.returnDF(queryString)
    if returnType.upper() != "DF":
        result = list(result['WORK_DT'])
    return result

def getNewsScore(isin, work_dt):
    queryString = f"""
        select round(count_b/count_a * 100) as mention_Score, round(sum_b/count_b * 100) positive_Score from
        (select a.count as count_a from
        (select * from
        (select count(result) as count from news where NEWS_DT > (SELECT TO_DATE('{work_dt}', 'YYYY/MM/DD') - 7 AS NEWS_DT FROM DUAL) group by isin)
        order by count desc) a 
        where rownum <= 1),
        (select count(result) as count_b, sum(result) as sum_b from news where isin = '{isin}' and NEWS_DT > (SELECT TO_DATE('{work_dt}', 'YYYY/MM/DD') - 7 AS NEWS_DT FROM DUAL)) b
    """
    result = DataFrameHandler.returnDF(queryString)
    result['ISIN'] = isin
    result['WORK_DT'] = work_dt
    return result

def mergeTmpIntoMain(option):
    target = option.upper()
    tmp = f"TMP_{target}"
    pk = ['ISIN', 'WORK_DT']
    DataFrameHandler.mergeTable(target, tmp, pk)