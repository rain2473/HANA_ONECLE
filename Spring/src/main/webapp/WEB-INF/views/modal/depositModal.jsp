<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<div id="depositModal" class="modal">
    <div class="modal-content-row">
        <div class="container">
            <div class="form-body">
                <div>
                    <h2>예수금 입출금</h2>
                </div>
                <div class="tab">
                    <div id="deposit" class="link-wrapper select">
                        <p>입금</p>
                    </div>
                    <div id="withdrawal" class="link-wrapper select">
                        <p>출금</p>
                    </div>
                </div>
                <form method="post">
                    <div class="form-group">
                        <label for="nubmer">현재 예수금 잔액</label>
                        <input classtype="nubmer" name="received" value="" disabled/>
                    </div>
                    <div class="form-group">
                        <label for="nubmer">현재 출금가능 금액</label>
                        <input type="nubmer" name="withdrawalAble" value="" disabled/>
                    </div>
                    <div class="form-group">
                        <label id="actionLabel" for="nubmer"></label>
                        <input type="nubmer" name="action">
                        <span style="color: orange;"></span>
                    </div>
                    <div class="buttonSet">
                        <div id="depositClose" class="link-wrapper close">
                            <p>닫기</p>
                        </div>
                        <div id="sumbitDepositInfo" class="link-wrapper " onclick="executeDeposit()">
                            <input type="button" value="진행하기">
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
