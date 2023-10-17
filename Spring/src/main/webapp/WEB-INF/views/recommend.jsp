<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>하나원클STOCK</title>
    <link href="../../resources/img/logo.png" rel="shortcut icon" type="image/x-icon">
    <link rel="stylesheet" href="../../resources/style/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
    <script src="../../resources/javascript/base.js"></script>
    <script src="../../resources/javascript/recommend.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
</head>
<body>
    <header>
        <%@ include file="include/header.jsp" %>
    </header>
<main>
    <div class="pages flexCenter">
        <div id="recommendModelPage" class="page">
            <div class="container">
                <div class="descript">
                    <h2>예측 모델 선택</h2>
                </div>
                <hr>
                <div class="recommendModelWrapper">
                    <div class="recommendModelContainer">
                        <div class="img_wrapper link-wrapper select on"  data-sector="AI">
                            <img src="../../../resources/img/ai_model.png" />
                        </div>
                    </div>
                    <div class="recommendModelContainer">
                        <div class="img_wrapper link-wrapper select on"  data-sector="STATISTICS">
                            <img src="../../../resources/img/statistics_model.png" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div id="recommendSectorPage" class="page">
            <%@ include file="include/recommendSector.html" %>
        </div>
        <div class="page">
            <%@ include file="include/recommendFilters.html" %>
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
</body>
<script>
    baseFunction();
    rangeSlide();
    handleOptionsButton();
    window.onload = () => {
        const recommendModelPage = document.querySelector("#recommendModelPage");
        const recommendModelWrapper = document.querySelector(".recommendModelWrapper");
        const recommendSectorPage = document.querySelector("#recommendSectorPage");
        const recommendSectorWrapper = document.querySelector(".recommendSectorWrapper");
        onePageScroll();
        selectRecommendOption();
        recommendModelPage.addEventListener('wheel', (event) => {
            preventNullSelection(recommendModelWrapper);
        });
        recommendSectorPage.addEventListener('wheel', (event) => {
            preventNullSelection(recommendSectorWrapper);
        });
        const getRecommend = document.querySelector(".getRecommend");
        getRecommend.addEventListener("click", function () {
            requestRecommend("/recommendOption");
        });
    };
</script>
</html>