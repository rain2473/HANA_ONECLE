<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE HTML>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>하나원클STOCK</title>
    <link href="../../resources/img/logo.png" rel="shortcut icon" type="image/x-icon">
    <link href="../../resources/style/style.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" rel="stylesheet" />
    <script src="../../resources/javascript/base.js"></script>
    <script src="../../resources/javascript/portfolio.js"></script>
    <script src="../../resources/javascript/trading.js"></script>
    <script src="https://code.jquery.com/jquery-latest.min.js"></script> 
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script>
        $.ajax({
            url: '/userName',
            type: "GET",
            dataType: "text",
            success: function(data) {
                var userName = data;
                setOwner(userName);
                $.ajax({
                    url: '/getBenefitData',
                    type: "GET",
                    success: function(data) {
                        setScoreImg(setReturnRate(data), "return");
                        $.ajax({
                        url: '/getRebalancedData',
                        type: "GET",
                        success: function(data) {
                            const rebalanced = showRebalancedTable('rebalanced', data);
                            let buy_amount = 0
                            let profit = 0;
                            jsonData = {
                                expected : rebalanced[0],
                                goal : data.goal
                            };
                            setScoreImg(setExpectedRate(jsonData), "Onecle");
                            data.sell.forEach(element => {
                                element.type = 1;
                                profit += element.amount;
                            });
                            data.buy.forEach(element => {
                                element.type = 0;
                                buy_amount += element.amount;
                            });
                            var order = data.sell.concat(data.buy);
                            requestOnecleData = {
                                buy_amount : buy_amount,
                                profit : profit,
                                value_amount : rebalanced[1],
                                order : order
                            };
                            var requestOnecleBtn = document.querySelector("#requestOnecle");
                            requestOnecleBtn.addEventListener("click", function() {
                                requestOnecle(requestOnecleData);
                            });
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
            },
            error: function(error) {
                console.error("에러 발생: ", error);
            }
        });
        $.ajax({
            url: '/MyAssetData',
            type: "GET",
            success: function(data) {
                let stocks = data.stocks;
                showDataTable('MyAsset', stocks);
            },
            error: function(error) {
                console.error("에러 발생: ", error);
            }
        });
    </script>
</head>
<body>
    <header>
        <%@ include file="include/header.jsp" %>
    </header>
    <main>
    <div class="pages flexCenter">
        <div class="page">
            <div class="container">
                <div id="sample" class="descript select">
                    <h2 class="ownerTitle">원클 솔루션</h2>
                </div>
                <hr>
                <div class="rebalanceWrapper">
                    <div class="rebalanceContainer">
                        <div class="title">
                            <h2>기존 포트폴리오</h2>
                        </div>
                        <div class="defaultTableWrapper wideTableWrapper stickyTableWrapper longTableWrapper">
                            <table class="defaultTable stickyTable">
                                <tbody id="MyAsset" >
                                    <tr>
                                        <th>자산 이름</th>
                                        <th>평가액(₩)</th>
                                        <th>비중(%)</th>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="scoreImage">
                            <div class="defaultTableWrapper miniTableWrapper">
                                <table class="defaultTable">
                                    <tbody id="Mybenefit" >
                                        <tr>
                                            <th>목표 수익률</th>
                                            <td id="targetRate"></td>
                                        </tr>
                                        <tr>
                                            <th>내 수익률</th>
                                            <td id="returnRate"></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="img_wrapper">
                                <div id="returnScoreCenti" class="img_wrapper">
                                </div>
                                <div id="returnScoreDeci" class="img_wrapper">
                                </div>
                                <div id="returnScoreUnit" class="img_wrapper">
                                </div>
                                <h2>%</h2>
                            </div>
                        </div>
                    </div>
                    <div class="img_wrapper">
                        <img src="../../resources/img/goto.png"/>
                    </div>
                    <div class="rebalanceContainer">
                        <div class="title">
                            <h2>원클 솔루션 제시안</h2>
                        </div>
                        <div class="defaultTableWrapper wideTableWrapper stickyTableWrapper longTableWrapper">
                            <table class="defaultTable stickyTable">
                                <tbody id="rebalanced" >
                                    <tr>
                                        <th>자산 이름</th>
                                        <th>평가액(₩)</th>
                                        <th>비중(%)</th>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="scoreImage">
                            <div class="defaultTableWrapper miniTableWrapper">
                                <table class="defaultTable">
                                    <tbody id="Onecle" >
                                        <tr>
                                            <th>목표 수익률</th>
                                            <td id="targetRate"></td>
                                        </tr>
                                        <tr>
                                            <th>기대 수익률</th>
                                            <td id="expectedRate"></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="img_wrapper">
                                <div id="OnecleScoreCenti" class="img_wrapper">
                                </div>
                                <div id="OnecleScoreDeci" class="img_wrapper">
                                </div>
                                <div id="OnecleScoreUnit" class="img_wrapper">
                                </div>
                                <h2>%</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id = "requestOnecle" class="link-wrapper select doOnecle">
                <h2>원클하기</h2>
            </div>
        </div>
    </div>
    <span id="top_button">
        <svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512">
            <title>scrollTopFixed</title>
            <path class="arrow-path" d="M268 112l144 144-144 144M392 256H100" />
        </svg>
    </span>
    <ul class="pagination">
    </ul>
</main>
<!-- <footer>
    <%@ include file="include/footer.jsp" %>
</footer> -->
<script>
    baseFunction();
    window.onload = () => {
        onePageScroll();
    };
</script>
</body>
</html>