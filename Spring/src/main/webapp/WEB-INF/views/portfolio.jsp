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
    <script src="../../resources/javascript/chartMaker.js"></script>
    <script src="../../resources/javascript/doughnutChartMaker.js"></script>
    <script src="../../resources/javascript/portfolio.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2.0.0"></script>
    <script src="https://code.jquery.com/jquery-latest.min.js"></script> 
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script src="https://unpkg.com/lightweight-charts/dist/lightweight-charts.standalone.production.js"></script>
    <script>
        $.ajax({
            url: '/userName',
            type: "GET",
            dataType: "text",
            success: function(data) {
                var userName = data;
                $.ajax({
                    url: '/getBenefitData',
                    type: "GET",
                    success: function(data) {
                        jsonData = {
                            name : userName,
                            data : {
                                benefit : data.benefit,
                                benchmark : data.benchmark,
                                goal : data.goal,
                            },
                        }
                        var returnScore = setReturnRate(data);
                        setScoreImg(returnScore, "return");
                        setAngle("returnSpeedometer", (returnScore - 50) / 50 * 90);
                        $("#chart .chartWrapper .tab .select").on("click", function (e) {
                            e.preventDefault();
                            reactClick($(this), jsonData);
                        });
                        $("#chart .chartWrapper .tab #1M").click();
                        var solutionScore = calcPortfolioScore(data.portfolioScore);
                        setAngle("solutionSpeedometer", (solutionScore - 50) / 50 * 90);
                        setScoreImg(solutionScore, "solution");
                    },
                    error: function(error) {
                        console.error("에러 발생: ", error);
                    }
                });
                setOwner(userName);
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
                let account = data.account;
                setAccountInfo(account);
                showDataTable('MyAsset', stocks);
                drawDoughnutData(stocks);
            },
            error: function(error) {
                console.error("에러 발생: ", error);
            }
        });
        $.ajax({
            url: '/portfolioModalData',
            type: "GET",
            success: function(data) {
                showDepositListTable(data.deposit);
                showOrderListTable(data.order);
                document.querySelector('input[name="received"]').value = data.depositData.deposit_RECEIVED;
                document.querySelector('input[name="withdrawalAble"]').value = data.depositData.withdrawal_AVAILABLE;
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
            <div id="asset" class="container">
                <div class="descript">
                    <h2 class="ownerTitle">자산 현황</h2>
                    <div class="buttonSet">
                        <div id="openDeposit" class="link-wrapper select">
                            <p>계좌 입출금 하기</p>
                        </div>
                        <div id="openDepositList" class="link-wrapper select">
                            <p>계좌 입출금 내역확인</p>
                        </div>
                    </div>
                </div>
                <hr>
                <div class="contents container flexRow">
                    <div class="chartWrapper doughnutChart">
                        <canvas class="chart-area" id="doughnutChart" width="500" height="500"></canvas>
                    </div>
                    <div class="accountContainer">
                        <div class="defaultTableWrapper wideTableWrapper">
                            <table class="defaultTable accountTable">
                                <tbody id="MyAccount" >
                                    <tr>
                                        <th>계좌번호</th>
                                        <td id="account"></td>
                                    </tr>
                                    <tr>
                                        <th>자산 평가액</th>
                                        <td id="total">원</td>
                                    </tr>
                                    <tr>
                                        <th>예수금</th>
                                        <td id="received">원</td>
                                    </tr>
                                    <tr>
                                        <th>출금가능 금액</th>
                                        <td id="withdrawal_available">원</td>
                                    </tr>
                                    <tr>
                                        <th>출금 금액</th>
                                        <td id="withdraw_amount">원</td>
                                    </tr>
                                    <tr>
                                        <th>총평가금액</th>
                                        <td id="valuation">원</td>
                                    </tr>
                                    <tr>
                                        <th>총평가손익</th>
                                        <td id="P&L">원</td>
                                    </tr>
                                    <tr>
                                        <th>총매입금액</th>
                                        <td id="buy">원</td>
                                    </tr>
                                </tbody>
                            </table>
                            </div>
                        <div class="defaultTableWrapper wideTableWrapper stickyTableWrapper">
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
                    </div>
                </div>
            </div>
        </div>
        <div class="page">
            <div id="chart" class="container">
                <div id="sample" class="descript select">
                    <h2 class="ownerTitle">수익률 현황</h2>
                    <div id="openOrder" class="link-wrapper select">
                        <p>주문내역 보러가기</p>
                    </div>
                </div>
                <hr>
                <div class="benefitWrapper">
                    <div class="chartWrapper">
                        <div class="tab">
                            <div id="1W" class="link-wrapper select" data-period="1W">
                                <p>1주</p>
                            </div>
                            <div id="2W" class="link-wrapper select" data-period="2W">
                                <p>보름</p>
                            </div>
                            <div id="1M" class="link-wrapper select" data-period="1M">
                                <p>한달</p>
                            </div>
                            <div id="3M" class="link-wrapper select" data-period="3M">
                                <p>3개월</p>
                            </div>
                            <div id="6M" class="link-wrapper select" data-period="6M">
                                <p>6개월</p>
                            </div>
                        </div>
                        <div class="legend-area"></div>
                        <div class="chart-area" id="chartArea1"></div>
                    </div>
                    <div class="benefitContainer">
                        <div class="title">
                            <h2>목표 수익률 달성 현황</h2>
                        </div>
                        <div id="returnSpeedometer" class="speedometerSet">
                            <%@ include file="include/scoreScale.html" %>
                            <%@ include file="include/speedometer.html" %>
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
                </div>
            </div>
        </div>
        <div class="page">
            <div class="container">
                <div id="sample" class="descript select">
                    <h2 class="ownerTitle">원클 솔루션</h2>
                </div>
                <hr>
                <div class="solutionWrapper">
                    <div class="solutionContainer">
                        <div class="title">
                            <h2>원클 포트폴리오 평가</h2>
                        </div>
                        <div id="solutionSpeedometer" class="speedometerSet">
                            <%@ include file="include/scoreScale.html" %>
                            <%@ include file="include/speedometer.html" %>
                        </div>
                        <div class="scoreImage">
                            <div class="defaultTableWrapper miniTableWrapper">
                                <table class="defaultTable">
                                    <tbody id="Mysolution" >
                                        <tr>
                                            <th>투자안정성</th>
                                            <td id="stability">23 점</td>
                                        </tr>
                                        <tr>
                                            <th>투자효율성</th>
                                            <td id="efficiency">23 점</td>
                                        </tr>
                                        <tr>
                                            <th>시장민감성</th>
                                            <td id="sensitivity">79 점</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="img_wrapper">
                                <div id="solutionScoreCenti" class="img_wrapper">
                                </div>
                                <div id="solutionScoreDeci" class="img_wrapper">
                                </div>
                                <div id="solutionScoreUnit" class="img_wrapper">
                                </div>
                                <h2>점</h2>
                            </div>
                        </div>
                    </div>
                    <div class="solutionContainer">
                        <div class="title">
                            <h2>원클 리밸런싱 솔루션</h2>
                        </div>
                        <div class="link-wrapper select img_wrapper img_wrapper80" data-href="solution">
                            <img src="../../resources/img/mainbanner2.png"/>
                        </div>
                        <div class="link-wrapper select doOnecle" data-href="solution">
                            <h2>솔루션 보러가기</h2>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="container">
        <%@ include file="modal/depositModal.jsp"%>
    </div>
    <div class="container">
        <%@ include file="modal/depositListModal.jsp"%>
    </div>
    <div class="container">
        <%@ include file="modal/orderListModal.jsp"%>
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
    openModalDeposit();
    closeModalDeposit();
    openModalDepositList();
    closeModalDepositList();
    openModalOrder();
    closeModalOrder();
    window.onload = () => {
        onePageScroll(animateSpeedometer);
        $("#depositModal .container .tab .select").on("click", changeDepositAction);
        $("#depositModal .container .tab #deposit").click();
    };
</script>
</body>
</html>