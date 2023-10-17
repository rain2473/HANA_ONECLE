FROM python:3.9.15

ENV PYTHONUNBUFFERED 0

WORKDIR /app

RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    unzip

RUN curl -sS -o - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && echo "deb http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list \
    && apt-get -y update \
    && apt-get -y install google-chrome-stable

RUN LATEST=$(wget -q -O - http://chromedriver.storage.googleapis.com/LATEST_RELEASE) \
    && wget -O /tmp/chromedriver.zip http://chromedriver.storage.googleapis.com/$LATEST/chromedriver_linux64.zip \
    && unzip /tmp/chromedriver.zip -d /app/chromedriver \
    && rm /tmp/chromedriver.zip \
    && chmod +x /app/chromedriver

ADD requirements.txt /app/
RUN pip3 install -r requirements.txt