# Author  : <홍윤기> 
# Contact : <rain2473@naver.com>
# Date    : <2023-08-24>

from bs4 import BeautifulSoup
import requests, json, os
from django.conf import settings
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

json_file_path = os.path.join(settings.BASE_DIR, 'resources', 'json/urlMapper.json')
with open(json_file_path, 'r') as json_file:
    urlMapper = json.load(json_file)

def fetchHtmlData(url):
    url = urlMapper[url]
    response = requests.get(url)
    print("crawling 성공")

    soup = BeautifulSoup(response.text, 'html.parser')
    containers = soup.find_all('div', class_='table-stock-wrap')
    container_html = '\n'.join(str(container) for container in containers)
    
    return container_html

def fetchJsonData(url):
    '''
    API 서버로 부터 실시간(20분 지연) 전종목 시세 정보를 가져와 json으로 반환하는 함수이다.
    [Parameters]
        String : url 
    [Returns]
        json : 전종목 시세 정보
    '''
    url = urlMapper[url]
    requests.packages.urllib3.util.ssl_.DEFAULT_CIPHERS += 'HIGH:!DH:!aNULL'
    try:
        requests.packages.urllib3.contrib.pyopenssl.DEFAULT_SSL_CIPHER_LIST += 'HIGH:!DH:!aNULL'
    except AttributeError:
        pass
    response = requests.get(url, verify=False)
    print("crawling 성공")
    
    if response.status_code == 200:
        json_data = response.json()
        return json_data
    else:
        print(f"Failed to fetch data from {url}. Status code: {response.status_code}")
        return None

def fetchAPIJsonData(url):
    jsonData = fetchJsonData(url)["StatisticSearch"]["row"]
    unique_data = {}  # 중복 데이터 처리를 위한 딕셔너리
    for data in jsonData:
        time = data['TIME'][:4] + "-" + data['TIME'][4:6] + "-" + data['TIME'][6:]
        value = float(data['DATA_VALUE'])

        # 중복 데이터 처리: 같은 시간을 가진 데이터 중 가장 높은 값을 선택
        if time in unique_data:
            if value > unique_data[time]["value"]:
                unique_data[time]["value"] = value
        else:
            unique_data[time] = {"time": time, "value": value}
    # 오름차순 정렬을 위해 시간을 기준으로 리스트로 변환
    sorted_data = sorted(unique_data.values(), key=lambda x: x["time"])
    
    result = json.dumps(sorted_data)
    return result

def fetchListData(url):
    listData = fetchJsonData(url)
    unique_data = {}  # 중복 데이터 처리를 위한 딕셔너리
    for values in listData:
        time = values[0]
        value = float(values[4])
        
        # 중복 데이터 처리: 같은 시간을 가진 데이터 중 가장 높은 값을 선택
        if time in unique_data:
            if value > unique_data[time]["value"]:
                unique_data[time]["value"] = value
        else:
            unique_data[time] = {"time": time, "value": value}
    
    # 오름차순 정렬을 위해 시간을 기준으로 리스트로 변환
    sorted_data = sorted(unique_data.values(), key=lambda x: x["time"])
    
    result = json.dumps(sorted_data)
    return result