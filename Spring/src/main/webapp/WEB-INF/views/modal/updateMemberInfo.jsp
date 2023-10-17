<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<div id="memberInfoModal" class="modal">
    <div class="modal-content">
        <div class="updateContainer container">
            <div class="form-body">
                <div>
                    <h2>회원 정보 수정</h2>
                </div>
                <form method="post">
                    <div class="form-group">
                        <label for="username">이름</label>
                        <span><input type="text" name="name" value=""></span>
                    </div>
                    <div class="form-group">
                        <label for="username">연락처</label>
                        <span><input type="tel" placeholder="010-0000-0000" name="phone" value=""></span>
                    </div>
                    <div class="form-group">
                        <label for="username">EMAIL</label>
                        <span><input type="email" placeholder="email@gmail.com" name="email" value=""></span>
                    </div>
                    <div class = "buttonSet">
                        <div id="memberInfoClose" class="link-wrapper close">
                            <p>닫기</p>
                        </div>
                        <div id="sumbitInvestInfo" class="link-wrapper " onclick="sendVerificationEmail()">
                            <input type="button" value="회원 정보 수정 완료">
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
</html>