<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<div id="orderListModal" class="modal">
    <div class="listModalContents modal-content-row">
        <div class="container">
            <div class="defaultTableWrapper modalTableWrapper">
                <table class="defaultTable stickyTable">
                    <tbody id="MyOrder" >
                        <tr>
                            <th>주문 일자</th>
                            <th>주문 종목</th>
                            <th>주문 단가</th>
                            <th>주문 수량</th>
                            <th>주문 총액</th>
                            <th>주문 구분</th>
                            <th>체결 여부</th>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="buttonSet">
                <div id="orderListClose" class="link-wrapper close">
                    <p>닫기</p>
                </div>
            </div>
        </div>
    </div>
</div>