# Author  : <홍윤기> 
# Contact : <rain2473@naver.com>
# Date    : <2023-08-24>
from bs4 import BeautifulSoup
import requests

def getRealtimePrice(isin):
    url = 'https://m.kbsec.com/go.able?linkcd=m04010000&nextGubun=false&JmGb=Q&hidNext=&stockcode='+isin
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    for a_tag in soup.find_all('a'):
        a_tag.extract()
    sections = soup.select('#table5dan')

    html_content = ''.join(str(section) for section in sections)

    return html_content