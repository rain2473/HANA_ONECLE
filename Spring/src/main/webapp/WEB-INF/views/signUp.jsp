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
            <img src="../../resources/img/gaze1.png">
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
                        <label for="userid">ID</label>
                        <span><input type="text" name="id"></span>
                        <span class="idChk" id="idChk" style="color: green;">ID를 입력해주세요</span>
                    </div>
                    <div class="form-group">
                        <label for="password">비밀번호</label>
                        <input class="userpw" type="password" name="password">
                        <span class="pwChk" style="color: green;">비밀번호를 입력해주세요</span>
                    </div>
                    <div class="form-group">
                        <label for="password">비밀번호 확인</label>
                        <input class="userpw-confirm" type="password" name="password_confirm">
                        <span class="pwChkRe" style="color: orange;">비밀번호를 입력해주세요</span>
                    </div>
                </div>
                <div class="page">
                    <div class="form-group">
                        <label for="username">이름</label>
                        <span><input type="text" name="name" value="${name}"></span>
                    </div>
                    <div class="form-group">
                        <label for="username">연락처</label>
                        <span><input type="tel" placeholder="010-0000-0000" name="phone"></span>
                    </div>
                    <div class="form-group">
                        <label for="username">EMAIL</label>
                        <span><input type="email" placeholder="email@gmail.com" name="email" value="${email}"></span>
                    </div>
                    <div class = "buttonSet">
                        <div id="EmailAuthentication" class="link-wrapper select" onclick="sendVerificationEmail()">
                            <input type="button" value="E-MAIL 인증하기">
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
    <div class="container">
        <%@ include file="modal/loginModal.jsp"%>
    </div>
    <div class="container">
        <%@ include file="modal/authenticationModal.jsp"%>
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
</body>
<script>
    baseFunction();
    openModalLogin();
    closeModalLogin();
    openModalAuthentication();
    closeModalAuthentication();
    checkVariable();
    window.onload = () => {
        onePageScroll();
    };
</script>
</html>