<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <title>하나원클STOCK</title>
    <link href="../../resources/img/logo.png" rel="shortcut icon" type="image/x-icon">
    <link rel="stylesheet" href="../../resources/style/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"/>
    <script src="../../resources/javascript/updateMemberInfo.js"></script>
    <script src="../../resources/javascript/base.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script>
        let userInfo;
        $.ajax({
            url: "/mypageData",
            type: "GET",
            success: function(data) {
                userInfo = data;
                setUserInfo(userInfo);
                setUpdateMemberInfoData();
            },
            error: function(error) {
                console.error("에러 발생: ", error);
            }
        });
    </script>
</head>
<body>
    <header>
        <%@ include file="include/header.jsp" %>
    </header>
<main>
    <div class="pages">
        <div class="page">
            <div class="container">
                <div class="descript">
                    <h2>회원정보</h2>
                    <div class="buttonSet">
                        <div id = "memberInfo" class="link-wrapper update">
                            <p>회원 정보 수정</p>
                        </div>
                        <div id = "Password" class="link-wrapper update">
                            <p>비밀번호 변경</p>
                        </div>
                    </div>
                </div>
                <hr>
                <div class="table-wrap">
                    <table>
                        <tbody>
                            <tr>
                                <th>회원이름</th>
                                <td id="name"></td>
                            </tr>
                            <tr>
                                <th>휴대폰</th>
                                <td id="phone"></td>
                            </tr>
                            <tr>
                                <th>E-Mail</th>
                                <td id="email"></td>
                            </tr>
                            <tr>
                                <th>계좌번호</th>
                                <td id="account"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="descript">
                    <h2>투자정보</h2>
                    <div class="buttonSet">
                        <div id = "investInfo" class="link-wrapper update">
                            <p>투자 정보 수정</p>
                        </div>
                        <div id = "investType" class="link-wrapper update" data-href="/updateInvestType">
                            <p>투자유형 수정</p>
                        </div>
                    </div>
                </div>
                <hr>
                <div class="table-wrap">
                    <table>
                        <tbody>
                            <tr>
                                <th>계좌 개설일</th>
                                <td id="join_date"></td>
                            </tr>
                            <tr>
                                <th>투자기간</th>
                                <td id="period">일</td>
                            </tr>
                            <tr>
                                <th>리밸런싱 기간</th>
                                <td id="rebalance">일</td>
                            </tr>
                            <tr>
                                <th>목표수익률</th>
                                <td id="goal">%</td>
                            </tr>
                            <tr>
                                <th>투자 성향</th>
                                <td id="inv_type"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="descript rightOnly">
                    <div id = "resign" class="link-wrapper update">
                        <p style="color: #afb0b0;">회원탈퇴</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="container">
        <%@ include file="modal/updateMemberInfo.jsp"%>
        <%@ include file="modal/updatePassWord.jsp"%>
        <%@ include file="modal/updateInvestInfo.jsp"%>
        <%@ include file="modal/resignCheck.jsp"%>
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
    baseFunction();
    openModalUpdate();
    closeModalUpdate();
    window.onload = () => {
        onePageScroll();
    };
</script>
</body>
</html>