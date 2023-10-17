import requests
from bs4 import BeautifulSoup
import pandas as pd
from .      import tokenizationKbalbert
from transformers import AlbertForSequenceClassification
from transformers import pipeline
from DB import DataFrameHandler

# 토크나이저 설정
tokenizer = tokenizationKbalbert.KbAlbertCharTokenizer.from_pretrained('lww7438/news_albert')
# 모델 설정
model = AlbertForSequenceClassification.from_pretrained('lww7438/news_albert')
# 뉴스 분류 파이프라인 설정
newsClassifier = pipeline(
    'sentiment-analysis',
    model=model.cpu(),
    tokenizer=tokenizer,
    framework='pt'
)

def getNewsData(ISIN, NEWS_DT):
    id = DataFrameHandler.findItems('NEWS', columns='count(*)', condition=f"ISIN='{ISIN}'")['COUNT(*)'][0]
    page = 1
    keepGoing = True
    newsList = []

    while (keepGoing):
        url = f'https://finance.naver.com/item/news_news.naver?code={ISIN}&page={page}'
        
        res = requests.get(url)
        soup = BeautifulSoup(res.content, 'html.parser')
        items = soup.select('body > .tb_cont > .type5 > tbody > tr')
        for item in items:
            try:
                newsTitle = item.select_one('td.title a').get_text(strip=True)
                newsDate = item.select_one('td.date').get_text(strip=True).split()[0]
                newsDate = newsDate.replace(".","/")
                newsScoringResult = newsClassifier(newsTitle)
                newsScore = round((2 * (newsScoringResult[0]['label'] == 'LABEL_1') - 1) * newsScoringResult[0]['score'],2)
                if newsDate >= NEWS_DT:
                    newsList.append({"NEWS_ID" : id, 'SUBJECT': newsTitle, 'NEWS_DT': newsDate, "RESULT" : newsScore})
                else:
                    keepGoing = False
                    break
                id += 1
            except:
                DataFrameHandler.insertItems('news_errors', pd.DataFrame({"ISIN" : [ISIN]}))
                keepGoing = False
                break
        page += 1

    df = pd.DataFrame(newsList)
    if df.empty:
        return df
    df['ISIN'] = ISIN
    df['NEWS_DT'] = pd.to_datetime(df['NEWS_DT'])

    return df