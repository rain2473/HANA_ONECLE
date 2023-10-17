# Author  : <홍윤기> 
# Contact : <rain2473@naver.com>
# Date    : <2023-08-20>

# Required Modules
import pandas                                       as pd
import numpy                                        as np
import plotly.graph_objects                         as go
from plotly.offline                                 import plot
from plotly                                         import express          as px
from Service                                        import Crawler

def extractDate(json_data):
    '''
    json으로 부터 시간 및 장 상태 정보와 주가 데이터를 분리해 json으로 반환하는 함수이다.
    [Parameters]
        json : 전종목 시세 정보
    [Returns]
        json, json : 시간 및 장 상태 정보, 전종목 시세 정보
    '''
    time = json_data['time']
    data_json = json_data['data']
    
    return time, data_json

def organizeJson(url):
    '''
    수집한 json을 원하는 최종 형태로 정리하는 함수이다.
    [Parameters]
        json : 정제된 전종목 시세 정보
    [Returns]
        json, json : 시장분류 정보, 전종목 시세 정보
    '''

    time, json_data = extractDate(Crawler.fetchJsonData(url))
    stock = []
    category = []

    for data in json_data:
        category.append({'sector' : data["name"], 'total_price' : data["total_price"], "type" : data["sub"][0]["type1"]})
        stock += data["sub"]
    
    return time, stock, category

def convertJson2DataFrame(json_data):
    '''
    json을 데이터 프레임으로 변환하는 함수이다.
    [Parameters]
        json : 변환할 json 데이터
    [Returns]
        pandas DataFrame : 변환된 pandas DataFrame 데이터
    '''
    if json_data is not None:
        df = pd.DataFrame(json_data)
        df.rename(columns = {'total_price' : 'amount'}, inplace=True)
        print("JSON 데이터를 DataFrame으로 변환 완료:")
        return df
    else:
        return None
    
def preprocessingDataFrame(json_data):
    '''
    json을 데이터 프레임으로 변환하며 전처리하는 함수이다.
    [Parameters]
        json : 정제된 전종목 시세 정보
    [Returns]
        pandas DataFrame : 전종목 시세
    '''
    df = convertJson2DataFrame(json_data)
    df.drop(columns = ['type2', 'li_class'], inplace=True)
    df.rename(columns = {'type1':'type', 'shortcode' : 'isin', 'stock_count' : 'volume', 'close':'price'}, inplace=True)
    df['color'] = (df['sign'].astype('str') + df['rate'].astype('str')).astype('float64')
    # 등락율을 조건에 맞게 catagoraze하는 조건을 선언
    condition = [df['color']>=3,
                (df['color']>=2)&(df['color']<3),
                (df['color']>=1)&(df['color']<2),
                (df['color']>=0)&(df['color']<1),
                (df['color']>=-1)&(df['color']<0),
                (df['color']>=-2)&(df['color']<-1),
                df['color']<-2]
    # 조건에 따라 변환될 catagory를 선언
    choices = ['+3','+2','+1','0','-1','-2','-3']
    # catagoraze한 등락율을 등락에 저장.
    df['color'] = np.select(condition,choices,default='0')
    print("DataFrame 전처리 완료:")
    return df

def joinDataFrame(stock, category):
    result_df = pd.merge(stock, category[['type','sector']], on='type', how='inner')
    result_df.drop(columns = ['type'], inplace = True)
    print("DataFrame JOIN 완료:")
    return result_df

def drowMarketMap(df, type):
    '''
    DF를 이용하여 Marketmap 그래프를 그리는 함수이다.
    [Parameters]
        pandas DataFrame : Marketmap을 그리는데 사용할 pandas DataFrame 데이터
    [Returns]
        str : html 파일에 삽입될 marketmap 그래프를 나타내는 코드
    '''
    # 트리맵 그래프 그림.
    fig = px.treemap(
        # kopsi - category - stock 순으로 marketmap 구현
        path=[px.Constant(type.upper()),df["sector"],df['name']],
        # marketmap의 박스 크기를 지정하는 변수 - amount
        values = df['amount'],
        # marketmap의 박스 색상을 지정하는 변수 - color
        color = df['color'],
        # 커서를 올리는 경우 표시할 정보 - 종목, 티커, 현재가, 등락율(%)
        hover_data =[df['name'],df['isin'],df['price'],df['rate'],df['diff'], df['sign'], df["sector"]],
        # 등락 정보에 따른 색상 지정
        color_discrete_map={'-3':'#2f89ff','-2':'#376eba','-1':'#3d5883',
                            '0':'#434653','+1':'#74404b','+2':'#b43a41','+3':'#f53538','(?)':'#fafbfb'},
        #
        labels={'labels':'name','color':'color'},    
        # 그래프의 높이 600으로 선언
        height = 500
    )
    # 그래프의 세부 정보 지정
    fig.update_traces(
        # 테두리 색상 회색
        root_color="#fafbfb",
        # 표시될 문자 형식 - 이름(줄바꿈) 등락율(%)
        texttemplate='<a href="https://finance.naver.com/item/main.naver?code=%{customdata[1]}"><span style="color:#fafbfb"> %{label}</span></a><br><span style="color:#fafbfb"> %{customdata[5]}%{customdata[3]}%</span>',
        # 표시될 문자의 위치 - 중단 중앙
        textposition="middle center",
        # 표시될 문자의 속성
        textfont={
            # 문자색상 흰색(선택옵션)
            "color":'#008485',
            # 문자 크기 22
            "size": 22,
            "family": "Hana2-Medium"
            },
        # 호버링 문자열 형식 - 티커(줄바꿈) 현재가(줄바꿈) 등락율(%)
        hovertemplate="%{customdata[0]}(%{customdata[1]})<br>%{customdata[2]}<br>%{customdata[5]}%{customdata[4]}(%{customdata[5]}%{customdata[3]})<extra></extra>"
    )
    # 그래프의 layout 지정 - 배경색상 회색
    fig.update_layout(
        go.Layout(paper_bgcolor='#008485'),
        margin={"r":0,"t":0,"l":0,"b":0}
    )
    fig_div = plot(fig, output_type='div')
    return fig_div

def getMarketMap(type):
    '''
    DF를 이용하여 marketmap 그래프를 html로 저장하는 함수이다.
    [Parameters]
        없음
    [Returns]
        str : html 파일에 삽입될 marketmap 그래프를 나타내는 코드
    '''
    # 최종 data 생성
    time, stock, category = organizeJson(type)
    date = time['date']
    status = time['status']
    if status == '장중':
        status += '(20분 지연)'
    stock_df = preprocessingDataFrame(stock)
    category_df = convertJson2DataFrame(category)
    final_df = joinDataFrame(stock_df, category_df)

    fig_div = drowMarketMap(final_df, type)

    return fig_div, date, status