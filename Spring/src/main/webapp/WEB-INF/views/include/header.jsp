<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<nav>
    <div class="container">
        <div class="img_wrapper link-wrapper" data-href="/">
            <img src="../../resources/img/logo.png">
        </div>
        <%
            String id = (String) session.getAttribute("id");
            if (id != null) {
        %>
        <div class="search-menu">
            <input id="search-box" type="text" placeholder=" SEARCH">
            <button class="search-button" onclick="searchStock()">
                <div class="link-wrapper select">
                    <p>검색</p>
                </div>
            </button>
            <div class="search-result"></div>
        </div>
        <div>
            <div class="link-wrapper select" data-href="http://localhost:8000/dataCenter/">
                <p>데이터센터</p>
            </div>
            <div class="link-wrapper select" data-href="recommend">
                <p>오늘의 추천주</p>
            </div>
            <div class="link-wrapper select" data-href="portfolio">
                <p>포트폴리오</p>
            </div>
            <div class="link-wrapper select" data-href="mypage">
                <p>마이페이지</p>
            </div>
            <div class="link-wrapper select" data-href="logoutMember">
                <p>로그아웃</p>
            </div>
            <%} else {%>
        <div>
            <div class="link-wrapper select" data-href="http://localhost:8000/dataCenter/">
                <p>데이터센터</p>
            </div>
            <div id="openLogIn-header" class="link-wrapper select">
                <p>로그인</p>
            </div>
            <%}%>
        </div>
    </div>
</nav>