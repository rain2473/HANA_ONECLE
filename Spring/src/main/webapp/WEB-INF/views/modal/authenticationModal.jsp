<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<div id="authenticationModal" class="modal">
    <div class="modal-content-row">
        <div class="modal-header">
            <img src="../../resources/img/logo.png" width="205">
        </div>
        <div class="modal-body">
            <div class="form-body">
                <h2>본인인증</h2>
                <form id="authenticationForm" method="post">
                    <div class="form-group">
                        <label for="authenticationId">인증번호</label>
                        <input type="text" placeholder="인증번호를 입력하세요" name="ePw">
                    </div>
                    <div class = "buttonSet">
                        <div id="authentication" class="link-wrapper select" onclick="verifyEmail()">
                            <input type="button" value="인증완료">
                        </div>
                        <div id="reissuance" class="link-wrapper select" onclick="sendVerificationEmail(); return false;">
                            <p>재발급</p>
                        </div>
                    </div>
                </form>
            </div>
            <div id="closeAuthentication" class="link-wrapper select close">
                <p>닫기</p>
            </div>
        </div>
    </div>
</div>