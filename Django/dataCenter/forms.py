from django import forms
from models import Stocks

class StocksForm(forms.ModelForm):
    class Meta:
        model = Stocks    # 사용할 모델
        fields = ['subject', 'avg_price', 'quantity',]     # QuestionForm에서 사용할 Question 모델의 속성

        labels = {
            'subject': '종목', 
            'avg_price': '평단가', 
            'quantity': '수량',
        }