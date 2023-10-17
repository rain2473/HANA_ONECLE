<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <title>하나원클STOCK</title>
    <link href="../../resources/img/logo.png" rel="shortcut icon" type="image/x-icon">
    <link rel="stylesheet" href="../../resources/style/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"/>
    <script src="../../resources/javascript/login.js"></script>
    <script src="../../resources/javascript/signup.js"></script>
    <script src="../../resources/javascript/base.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
</head>
<body>
    <header>
        <%@ include file="include/header.jsp" %>
    </header>
<main>
    <div class="process">
        <div class="img_wrapper">
            <img src="../../resources/img/gaze3.png">
        </div>
        <div class="processText">
            <div>
                <p>1단계 : 통합회원가입</p>
            </div>
            <div>
                <p>2단계 : 투자성향 문진표</p>
            </div>
            <div>
                <p>3단계 : 투자정보 입력</p>
            </div>
        </div>
    </div>
    <div class="pagesSignUp">
        <div id= signUpContainer class="form-body">
            <form id="signupForm" method="post">
                <div class="page">
                    <div class="form-group">
                        <label for="userTarget">목표수익률</label>
                        <span><input type="number" placeholder="1 ~ 1000 범위에서 입력하세요(단위 : %)" name="target"></span>
                        <span class="targetChk" style="color: green;"></span>
                    </div>
                    <div class="form-group">
                        <label for="userPeriod">투자 기간</label>
                        <span><input type="number" placeholder="1 ~ 60 범위에서 입력하세요(단위 : 개월)" name="period"></span>
                        <span class="periodChk" style="color: green;"></span>
                    </div>
                    <div class="form-group">
                        <label for="userRebalance">리밸런싱 주기</label>
                        <span><input type="number" placeholder="1 ~ 6 범위에서 입력하세요(단위 : 개월)" name="rebalance"></span>
                        <span class="rebalanceChk" style="color: green;"></span>
                    </div>
                    <div class = "buttonSet">
                        <div id="sumbitInvestInfo" class="link-wrapper select" data-href="/signUpFinished">
                            <input type="button" value="투자 정보 입력 완료">
                            <span class="one"></span>
                            <span class="two"></span>
                            <span class="three"></span>
                            <span class="four"></span>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
    <div class="container">
        <%@ include file="modal/loginModal.jsp"%>
    </div>
    <span id="top_button">
        <svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512">
            <title>scrollTopFixed</title>
            <path class="arrow-path" d="M268 112l144 144-144 144M392 256H100" />
        </svg>
    </span>
</main>
<!-- <footer>
    <%@ include file="include/footer.jsp" %>
</footer> -->
</body>
<script>
    baseFunction();
    openModalLogin();
    closeModalLogin();
</script>
</html>