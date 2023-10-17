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

def mergeTmpIntoMain(option):
    target = option.upper()
    tmp = f"TMP_{target}"
    pk = ['ISIN', 'WORK_DT']
    DataFrameHandler.mergeTable(target, tmp, pk)