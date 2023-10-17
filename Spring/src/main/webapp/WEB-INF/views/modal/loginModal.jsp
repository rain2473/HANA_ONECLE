<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<div id="logInModal" class="modal">
    <div class="modal-content-row">
        <div class="modal-header">
            <img src="../../resources/img/logo.png" width="205">
        </div>
        <div class="modal-body">
            <div class="form-body">
                <h2>로그인</h2>
                <form id="loginForm" method="post">
                    <div class="form-group">
                        <label for="userid">ID</label>
                        <input type="text" id="username" name="id">
                    </div>
                    <div class="form-group">
                        <label for="password">비밀번호</label>
                        <input type="password" id="password" name="pw">
                    </div>
                    <div class = "buttonSet">
                        <div id="logIn" class="link-wrapper select" onclick="loginFormFunc(); return false;">
                            <input type="button" value="로그인">
                        </div>
                        <div id="signUp" class="link-wrapper select" data-href="signUp">
                            <p>회원가입</p>
                        </div>
                    </div>
                </form>
            </div>
            <div id="closeLogIn" class="link-wrapper select close">
                <p>닫기</p>
                <span class="one"></span>
                <span class="two"></span>
                <span class="three"></span>
                <span class="four"></span>
            </div>
        </div>
    </div>
</div>