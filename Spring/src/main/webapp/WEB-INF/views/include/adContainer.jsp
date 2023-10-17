<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<div id="ad" class="container">
    <div class="img_wrapper">
        <span class="arrow_backward">
            <svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512">
                <title>Arrow Backward</title>
                <path class="arrow-path" d="M268 112l144 144-144 144M392 256H100" />
            </svg>
        </span>
        <img id="adImg" src="../../resources/img/mainbanner1.png">
        <span class="arrow_forward">
            <svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512">
                <title>Arrow Forward</title>
                <path class="arrow-path" d="M268 112l144 144-144 144M392 256H100" />
            </svg>
        </span>
    </div>
    <div class="quickMenuSet">
    <%
        if (id != null) {
    %>
        <div class="quickMenus">
            <div class="quickMenu link-wrapper" data-href="http://localhost:8000/dataCenter/">
                <div class="img_wrapper">
                    <img src="../../resources/img/datacenter.png">
                </div>
            </div>
            <div class="quickMenu link-wrapper" data-href="recommend">
                <div class="img_wrapper">
                    <img src="../../resources/img/recommend.png">
                </div>
            </div>
        </div>
        <div class="quickMenus">
            <div class="quickMenu link-wrapper" data-href="portfolio">
                <div class="img_wrapper">
                    <img src="../../resources/img/portfolio.png">
                </div>
            </div>
            <div class="quickMenu link-wrapper" data-href="mypage">
                <div class="img_wrapper">
                    <img src="../../resources/img/mypage.png">
                </div>
            </div>
        </div>
    <%} else {%>
        <div class="quickMenus">
            <div class="quickMenu link-wrapper" data-href="http://localhost:8000/dataCenter/">
                <div class="img_wrapper">
                    <img src="../../resources/img/datacenter.png">
                </div>
            </div>
            <div id="openLogIn" class="quickMenu link-wrapper">
                <div class="img_wrapper">
                    <img src="../../resources/img/login.png">
                </div>
            </div>
        </div>
        <div class="quickMenus">
            <div class="quickMenu link-wrapper" data-href="signUp">
                <div class="img_wrapper">
                    <img src="../../resources/img/introduce.png">
                </div>
            </div>
            <div class="quickMenu link-wrapper" data-href="signUp">
                <div class="img_wrapper">
                    <img src="../../resources/img/signup.png">
                </div>
            </div>
        </div>
    <%}%>
    </div>
</div>