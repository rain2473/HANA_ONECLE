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
    <script src="../../resources/javascript/base.js"></script>
    <script src="../../resources/javascript/subjectTypingEffect.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
</head>
<body>
    <header>
        <%@ include file="include/header.jsp" %>
    </header>
<main>
    <div class="pages">
        <div id="logo" class="page">
            <div>
                <p id="subject"></p>
            </div>
            <div class="link-wrapper select" data-href="/">
                <p>메인페이지로</p>
            </div>
        </div>
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
    typingSubject(["회원 탈퇴가 완료되었습니다."], "#subject", 0);
</script>
</html>