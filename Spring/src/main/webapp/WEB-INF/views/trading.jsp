<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE HTML>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>하나원클STOCK</title>
    <link href="../../resources/img/logo.png" rel="shortcut icon" type="image/x-icon">
    <link href="../../resources/style/style.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" rel="stylesheet" />
    <script src="../../resources/javascript/candleChartMaker.js"></script>
    <script src="../../resources/javascript/base.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script src="../../resources/javascript/login.js"></script>
    <script src="../../resources/javascript/trading.js"></script>
    <script src="https://unpkg.com/lightweight-charts/dist/lightweight-charts.standalone.production.js"></script>
</head>
<body>
    <header>
        <%@ include file="include/header.jsp" %>
    </header>
    <main>
    <h2 id = "stockName"></h2>
    <div class="pages flexCenter big">
        <div id="trading" class="container">
            <div id="recommendStock" class="stockList left">
                <h3>원클 추천 종목</h3>
                <%@ include file="include/stockList.html" %>
            </div>
            <div id="ownStock" class="stockList right">
                <h3>나의 보유 종목</h3>
                <%@ include file="include/stockList.html" %>
            </div>
            <div class="page tradingBody">
                <div id="chart" class="container">
                    <div id="sample" class="descript">
                        <h2>차트</h2>
                    </div>
                    <hr>
                    <div class="chartWrapper">
                        <div class="legend-area"></div>
                        <div class="chart-area" id="chartArea1"></div>
                    </div>
                </div>
            </div>
            <div class="page">
                <div id="consensus" class="container">
                    <div class="descript">
                        <h2>투자의견</h2>
                    </div>
                    <hr>
                    <div class="consensusWrapper">
                        <div class="consensusContainer">
                            <div class="title">
                                <h2>원클 예측 의견</h2>
                            </div>
                            <div id="aiSpeedometer" class="speedometerSet">
                                <%@ include file="include/orderScale.html" %>
                                <%@ include file="include/speedometer.html" %>
                            </div>
                            <div class="defaultTableWrapper">
                                <%@ include file="include/aiTable.html" %>
                            </div>
                        </div>
                        <div class="consensusContainer">
                            <div class="title">
                                <h2>기술 분석 의견</h2>
                            </div>
                            <div id="statisticsSpeedometer" class="speedometerSet">
                                <%@ include file="include/orderScale.html" %>
                                <%@ include file="include/speedometer.html" %>
                            </div>
                            <div class="defaultTableWrapper">
                                <%@ include file="include/statisticsTable.html" %>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="page">
                <div id="tradeOrder" class="container">
                    <div class="descript">
                        <h2>거래주문</h2>
                        <div id="orderType" class="link-wrapper select buy" onclick="changeTradeMode(currentIsin)">
                            <p>매수 mode</p>
                        </div>
                    </div>
                    <hr>
                    <div class="callWrapper heightFull">
                        <div class="call">
                            <div id="scraped-content">
                            </div>
                        </div>
                        <div class="form-wrap">
                            <%@ include file="include/callForm.html" %>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <ul class="pagination">
    </ul>
</main>
<!-- <footer>
    <%@ include file="include/footer.jsp" %>
</footer> -->
<script>
    let currentIsin = window.location.href.split("=")[1];
    let amount;
    let maximum;
    $.ajax({
        url: '/tradingData?isin='+String(currentIsin),
        type: "GET",
        success: function(data) {
            drawCandleChart(data, 960, 500);
            setStockInfo(data['name'], currentIsin);
        },
        error: function(error) {
            console.error("에러 발생: ", error);
        }
    });
    $.ajax({
        url: '/recommendTotal',
        type: "GET",
        success: function(data) {
            const recommendStock = document.querySelector("#recommendStock");
            const stockListWrapper = recommendStock.querySelector(".stockListWrapper");
            data.recommend.forEach(function (recommend) {
                const newDiv = document.createElement("div");
                newDiv.classList.add("link-wrapper", "select");
                newDiv.setAttribute("data-href", "trading?isin=" + recommend.isin);
                newDiv.innerHTML = recommend.name +'\n(' + recommend.isin + ')';
                stockListWrapper.appendChild(newDiv);
                linkToPage();
            });
        },
        error: function(error) {
            console.error("에러 발생: ", error);
        }
    });
    $.ajax({
        url: '/MyStocksData',
        type: "GET",
        success: function(data) {
            const ownStock = document.querySelector("#ownStock");
            const stockListWrapper = ownStock.querySelector(".stockListWrapper");
            data.forEach(function (mystock) {
                const newDiv = document.createElement("div");
                newDiv.classList.add("link-wrapper", "select");
                newDiv.setAttribute("data-href", "trading?isin=" + mystock.isin);
                newDiv.innerHTML = mystock.name +'\n(' + mystock.isin + ')';
                stockListWrapper.appendChild(newDiv);
                linkToPage();
            });
        },
        error: function(error) {
            console.error("에러 발생: ", error);
        }
    });
    $.ajax({
        url: '/scoreData?isin='+String(currentIsin),
        type: "GET",
        success: function(data) {
            let tmp = setStockScore(data);
            setAngle("aiSpeedometer", tmp[0]);
            setAngle("statisticsSpeedometer", tmp[1]);
        },
        error: function(error) {
            console.error("에러 발생: ", error);
        }
    });
    $(document).ready(function () {
        $.ajax({
            url: '/getReceiveForTransaction',
            type: "GET",
            success: function(data) {
                amount = data.deposit_RECEIVED;
                $.ajax({
                    url: '/stocksInBalance?isin='+String(currentIsin),
                    type: "GET",
                    success: function(data) {
                        maximum = data;
                        setInterval(function () {
                            getCallPrice(currentIsin, amount, maximum);
                        }, 1000);
                    },
                    error: function(error) {
                        console.error("에러 발생: ", error);
                    }
                });
            },
            error: function(error) {
                console.error("에러 발생: ", error);
            }
        });
    })
    window.onload = () => {
        onePageScroll(animateSpeedometer);
        baseFunction();
    };
</script>
</body>
</html>