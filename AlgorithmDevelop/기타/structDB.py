from DB import DataFrameHandler
from DB import AIModelHandler
import pandas as pd
import pickle, time

pd.options.mode.chained_assignment = None

batchSize = 100000
for i in range(1, 6):
    start = batchSize * i
    end = batchSize * (i + 1)
    print(f'select 시작')
    start_time = time.time()
    ohlcv = DataFrameHandler.findItems('(select tmp_ohlcv.*, rownum as rm from tmp_ohlcv) a', condition=f'a.rm <= {end} and a.rm > {start}')
    end_time = time.time()
    print(f'select 끝')
    elapsed_time = end_time - start_time

    print(f"{batchSize}건 쿼리 실행 소요 시간: {elapsed_time:.4f} 초")

for i in range(1, 6):
    start = batchSize * i
    end = batchSize * (i + 1)
    print(f'select 시작')
    start_time = time.time()
    ohlcv = DataFrameHandler.findItems('(select tmp_ohlcv.*, rownum as rm from tmp_ohlcv) a', condition=f'a.rm <= {end} and a.rm > {start}', many=True)
    end_time = time.time()
    print(f'select 끝')
    elapsed_time = end_time - start_time

    print(f"{batchSize}건 쿼리 실행 소요 시간: {elapsed_time:.4f} 초")