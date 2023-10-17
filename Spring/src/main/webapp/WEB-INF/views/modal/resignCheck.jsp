<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<div id="resignModal" class="modal">
    <div class="modal-content">
        <div class="img_wrapper notMain">
            <img src="../../resources/img/logo.png">
        </div>
        <div class = "warning">
            <p>정말로 탈퇴하시겠습니까?</p>
        </div>
        <div class="buttonSet">
            <div id="resignClose" class="link-wrapper close">
                <p>닫기</p>
            </div>
            <div class="link-wrapper select" data-href="/resignFinished">
                <p>탈퇴진행</p>
            </div>
        </div>
    </div>
</div>
<script>
    baseFunction();
</script>