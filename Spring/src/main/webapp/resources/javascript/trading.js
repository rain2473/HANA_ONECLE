function getCallPrice(isin, amount, maximum){
    const orderType = document.querySelector("#orderType").classList;
    let mode;
    if (isin ===undefined){
        isin="";
    }
    var externalPageUrl = 'http://localhost:8000/dataCenter/api/prices/' + isin;
    var divElement = document.getElementById('scraped-content');
    fetch(externalPageUrl)
    .then(response => response.text())
    .then(data => {
        divElement.innerHTML = data;
        if (orderType.contains("buy")){
            mode = "buy";
        } else{
            mode = "sell";
        }
        setCallPrice(mode, amount, maximum);
        setOrderQuantity(amount, maximum);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function changeTradeMode(isin){
    const orderType = document.querySelector("#orderType");
    const modeText = orderType.querySelector('p');
    const orderTypeClassList = orderType.classList;
    const orderPriceLable = document.querySelector('label[for="orderPrice"]');
    const orderQuantityLabel = document.querySelector('label[for="orderQuantity"]');
    const totalOrderLabel = document.querySelector('label[for="totalOrder"]');

    if (orderTypeClassList.contains("buy")){
        $.ajax({
            url: '/stockExistInBalance?isin='+String(currentIsin),
            type: "GET",
            success: function(data) {
                if(data){
                    orderTypeClassList.remove("buy");
                    orderTypeClassList.add("sell");
                    modeText.innerText = "매도 mode";
                    orderPriceLable.textContent = "매도주문 가격:";
                    orderQuantityLabel.textContent = "매도주문 수량:";
                    totalOrderLabel.textContent = "매도주문 총액:";
                } else {
                    alert("보유 중이지 않은 종목은 매도가 불가능합니다.");
                }
            },
            error: function(error) {
                console.error("에러 발생: ", error);
            }
        });
    } else{
        orderTypeClassList.remove("sell");
        orderTypeClassList.add("buy");
        modeText.innerText = "매수 mode";
        orderPriceLable.textContent = "매수주문 가격:";
        orderQuantityLabel.textContent = "매수주문 수량:";
        totalOrderLabel.textContent = "매수주문 총액:";
    }
    getCallPrice(isin, amount, maximum);
}

function setCallPrice(mode, amount, maximum){
    const orderPriceInput = document.querySelector("#orderPrice");
    const orderQuantity = document.querySelector("#orderQuantity");
    const availableFundsInput = document.querySelector("#availableFunds");
    const fid_sAskprc1 = document.querySelector('span[name="fid_sAskprc1"]').textContent;
    const fid_bAskprc1 = document.querySelector('span[name="fid_bAskprc1"]').textContent;
    let price;

    if(mode === "buy"){
        price = fid_sAskprc1;
        orderQuantity.setAttribute("value", Math.floor(amount/Number(price.replace(",",""))));
        availableFundsInput.setAttribute("value", Math.floor(amount/Number(price.replace(",",""))) * Number(price.replace(",","")));
    } else{
        price = fid_bAskprc1;
        orderQuantity.setAttribute("value", maximum);
        availableFundsInput.setAttribute("value", maximum * Number(price.replace(",","")));
    }
    orderPriceInput.setAttribute("placeholder", price);
}

function setStockInfo(StockName, stockIsin){
    var nameSpace = document.getElementById("stockName");
    nameSpace.textContent = `${StockName}(${stockIsin})`;
}

function setStockScore(ScoreInfo){
    var aiList = ["updownScore", "priceScore"];
    var newsList = ["mentionScore", "positiveScore"];
    var statisticsList = ["rsiScore", "stochasticScore", "momentumScore", "obvScore"];
    var aiScore = 0;
    var statisticsScore = 0;

    aiList.forEach(function (ai) {
        var tr = document.getElementById(ai);
        var scoreSpace = tr.getElementsByClassName("aiScore")[0];
        var decisionSpace = tr.getElementsByClassName("aiDecision")[0];
        scoreSpace.textContent = ScoreInfo[ai];
        if (ScoreInfo[ai] >= 10){
            decisionSpace.textContent = "매수";
        } else {
            decisionSpace.textContent = "매도";
        }
        aiScore += Number(ScoreInfo[ai]);
    })

    newsList.forEach(function (ai) {
        var tr = document.getElementById(ai);
        var scoreSpace = tr.getElementsByClassName("aiScore")[0];
        var decisionSpace = tr.getElementsByClassName("aiDecision")[0];
        scoreSpace.textContent = ScoreInfo[ai];
        if (ScoreInfo[ai] >= 80){
            decisionSpace.textContent = "강력 매수";
        } else if (ScoreInfo[ai] < 80 && ScoreInfo[ai] >= 60){
            decisionSpace.textContent = "매수";
        } else if (ScoreInfo[ai] < 60 && ScoreInfo[ai] >= 40){
            decisionSpace.textContent = "중립";
        } else if (ScoreInfo[ai] < 40 && ScoreInfo[ai] >= 20){
            decisionSpace.textContent = "매도";
        } else {
            decisionSpace.textContent = "강력 매도";
        }
        aiScore += Number(ScoreInfo[ai]);
    })

    statisticsList.forEach(function (statistics) {
        var tr = document.getElementById(statistics);
        var scoreSpace = tr.getElementsByClassName("statisticsScore")[0];
        var decisionSpace = tr.getElementsByClassName("statisticsDecision")[0];
        scoreSpace.textContent = ScoreInfo[statistics];
        if (ScoreInfo[statistics] >= 80){
            decisionSpace.textContent = "강력 매수";
        } else if (ScoreInfo[statistics] < 80 && ScoreInfo[statistics] >= 60){
            decisionSpace.textContent = "매수";
        } else if (ScoreInfo[statistics] < 60 && ScoreInfo[statistics] >= 40){
            decisionSpace.textContent = "중립";
        } else if (ScoreInfo[statistics] < 40 && ScoreInfo[statistics] >= 20){
            decisionSpace.textContent = "매도";
        } else {
            decisionSpace.textContent = "강력 매도";
        }
        statisticsScore += Number(ScoreInfo[statistics]);
    })

    return [(aiScore / 220 * 180 - 90), (statisticsScore / 400 * 180 - 90)]
}

function setOrderQuantity(amount, maximum){
    const orderType = document.querySelector("#orderType").classList;
    const orderQuantity = document.querySelector("#orderQuantity");
    const totalOrder = document.querySelector("#totalOrder");
    const fid_sAskprc1 = document.querySelector('span[name="fid_sAskprc1"]').textContent;
    const fid_bAskprc1 = document.querySelector('span[name="fid_bAskprc1"]').textContent;
    const percents= ["#percent10", "#percent25", "#percent50", "#percent100"];
    
    let price, _maximum;

    if (orderType.contains("buy")){
        price = Number(fid_sAskprc1.replace(",",""));
        _maximum = Math.floor(amount/price);
    } else{
        price = Number(fid_bAskprc1.replace(",",""));
        _maximum = maximum;
    };

    orderQuantity.addEventListener('input', function () {
        var input = parseInt(orderQuantity.value);
        totalOrder.value = input * price;
    });

    percents.forEach(percent => {
        let percentBtn = document.querySelector(percent);
        let value = Math.floor(_maximum / 100 * Number(percent.replace("#","").replace("percent","")))
        percentBtn.addEventListener("click", function(){
            orderQuantity.value = value;
            totalOrder.value = value * price;
        })
    });
}

function requestOrder(currentIsin, amount, maximum){
    const orderType = document.querySelector("#orderType").classList;
    const orderQuantity = Number(document.getElementById("orderQuantity").value);
    const totalOrder = Number(document.getElementById("totalOrder").value);
    let type;
    // let workDt = getCurrentDate();
    let workDt = "2023/09/25";

    if (orderType.contains("buy")){
        type = 0;
    } else{
        type = 1;
    };

    if (orderQuantity < 0){
        alert("음수 수량 입력 불가능합니다!!");
    } else if(orderQuantity > maximum && type == 1){
        alert("최대 매도 가능한 수량을 초과했습니다!!");
    } else if(totalOrder > amount && type == 0){
        alert("최대 매수 가능한 수량을 초과했습니다!!");
    } else{
        const data = {
            isin : currentIsin,
            orderPrice: totalOrder/orderQuantity,
            orderVolume: orderQuantity,
            orderTotal: totalOrder,
            orderType : type,
            workDt : workDt,
        };
        $.ajax({
            type: "POST",
            url: "/requestOrder",
            data: JSON.stringify(data),
            contentType: 'application/json',
            error: function (xhr, status, error) {
                alert(error + "error");
            },
            success: function (response) {
                if (response === "success") {
                    alert(`주문 요청 성공`);
                } else {
                    alert("주문 요청 실패");
                }
            }
        });
    }
}

function getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); // 월은 0부터 시작하므로 +1
    const day = now.getDate().toString().padStart(2, '0');
    return year + '/' + month + '/' + day;
}
