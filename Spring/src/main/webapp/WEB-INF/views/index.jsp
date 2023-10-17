<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <title>하나원클 STOCK</title>
    <link href="../../resources/img/logo.png" rel="shortcut icon" type="image/x-icon">
    <link href="../../resources/style/style.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" rel="stylesheet"/>
    <script src="../../resources/javascript/login.js"></script>
    <script src="../../resources/javascript/base.js"></script>
    <script src="../../resources/javascript/subjectTypingEffect.js"></script>
    <script src="../../resources/javascript/mainbanner.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
</head>
<body>
    <header>
        <%@ include file="include/header.jsp" %>
    </header>
<main>
    <div class="pages">
        <%
        if (id == null) {
        %>
        <div id="logo" class="page">
            <div>
                <p id="subject"></p>
            </div>
        </div>
        <%}%>
        <div class="page">
            <%@ include file="include/adContainer.jsp"%>
            <div id="slideBanner" class="quickMenuSet">
                <div id="recommendTotal" class="quickMenus getRecommend">
                    <div class="quickMenu" data-href="/recommendTotal">
                        <div class="img_wrapper">
                            <img src="../../resources/img/total5.png">
                        </div>
                    </div>
                </div>
                <div id="recommendKospi" class="quickMenus getRecommend">
                    <div class="quickMenu" data-href="/recommendKospi">
                        <div class="img_wrapper">
                            <img src="../../resources/img/kospi5.png">
                        </div>
                    </div>
                </div>
                <div id="recommendKosdaq" class="quickMenus getRecommend">
                    <div class="quickMenu" data-href="/recommendKosdaq">
                        <div class="img_wrapper">
                            <img src="../../resources/img/kosdaq5.png">
                        </div>
                    </div>
                </div>
                <div id="recommendVolume10" class="quickMenus getRecommend">
                    <div class="quickMenu" data-href="/recommendVolume10">
                        <div class="img_wrapper">
                            <img src="../../resources/img/volume5.png">
                        </div>
                    </div>
                </div>
                <div id="recommendUpdown10" class="quickMenus getRecommend">
                    <div class="quickMenu" data-href="/recommendUpdown10">
                        <div class="img_wrapper">
                            <img src="../../resources/img/updown5.png">
                        </div>
                    </div>
                </div>
                <div id="recommendService" class="quickMenus getRecommend">
                    <div class="quickMenu" data-href="/recommendService">
                        <div class="img_wrapper">
                            <img src="../../resources/img/service5.png">
                        </div>
                    </div>
                </div>
                <div id="recommendManufacturing" class="quickMenus getRecommend">
                    <div class="quickMenu" data-href="/recommendManufacturing">
                        <div class="img_wrapper">
                            <img src="../../resources/img/manufacturing5.png">
                        </div>
                    </div>
                </div>
            </div>
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
    <ul class="pagination">
    </ul>
</main>
<!-- <footer>
    <%@ include file="include/footer.jsp" %>
</footer> -->
<script type="text/javascript">
    typingSubject(["ONE CLICK, ONCE CLEAR"], "#subject");
    changeBanner();
    baseFunction();
    openModalLogin();
    closeModalLogin();
    const getRecommends = document.querySelectorAll(".getRecommend");
    for (let i = 0; i < getRecommends.length; i++) {
        const recommendElement = getRecommends[i];
        const dataHref = recommendElement.querySelector(".quickMenu").getAttribute("data-href");
        recommendElement.addEventListener("click", function () {
            requestQuickRecommend(dataHref);
        });
    }

    setTimeout(() => {
        window.onload = () => {
            onePageScroll();
        };
    }, 1000);
</script>
</body>
</html>