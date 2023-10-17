<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<div id="investInfoModal" class="modal">
    <div class="modal-content">
        <div class="updateContainer form-body">
            <div>
                <h2>투자 정보 수정</h2>
            </div>
            <form method="post">
                <div class="form-group">
                    <label for="userTarget">목표수익률</label>
                    <span><input type="number" placeholder="1 ~ 1000 범위에서 입력하세요(단위 : %)" name="target"></span>
                    <span class="targetChk" style="color: green;"></span>
                </div>
                <div class="form-group">
                    <label for="userPeriod">투자 기간</label>
                    <span><input type="number" placeholder="1 ~ 60 범위에서 입력하세요(단위 : 개월)" name="period"></span>
                    <span class="periodChk" style="color: green;"></span>
                </div>
                <div class="form-group">
                    <label for="userRebalance">리밸런싱 주기</label>
                    <span><input type="number" placeholder="1 ~ 6 범위에서 입력하세요(단위 : 개월)" name="rebalance"></span>
                    <span class="rebalanceChk" style="color: green;"></span>
                </div>
                <div class = "buttonSet">
                    <div id="investInfoClose" class="link-wrapper close">
                        <p>닫기</p>
                    </div>
                    <div id="sumbitInvestInfo" class="link-wrapper" onclick="sendVerificationEmail()">
                        <input type="button" value="투자 정보 수정 완료">
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>
<script>
    // 회원 가입
    $('#signupForm').submit(function (event) {
        event.preventDefault(); // 기본 동작 방지 (페이지 새로고침)

        // 입력된 정보 가져오기
        const id = $('#signupForm input[name="id"]').val();
        const password = $('#signupForm input[name="password_confirm"]').val();
        const name = $('#signupForm input[name="name"]').val();
        const email = $('#signupForm input[name="email"]').val();
        const phoneNumber = $('#signupForm input[name="phone"]').val();
        const provider = $('[name="provider"]').val();
        const goal = $('[name="goal"]').val();

        // Check if email verification is completed
        if (ePw === undefined) {
            alert("이메일 인증을 완료해야 합니다.");
            return;
        }

        const data = {
            id: id,
            password: password,
            name: name,
            email: email,
            phoneNumber: phoneNumber,
            provider: provider,
            goal: goal
        };

        // Ajax 요청 보내기
        $.ajax({
            url: '/insertMember',
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (response) {
                if (response === "회원 등록 성공") {
                    alert("회원 등록 성공");
                    var link = document.createElement("a");
                    link.href = "/";
                    link.click();
                } else {
                    console.error("회원 등록 실패");
                }
            }
        });
    });

    // 유효성 검사
    var timer; // 타이머 변수

    $('[name=id]').on('input', function () {
        clearTimeout(timer);
        var id = $(this).val();
        timer = setTimeout(function () {
            $.ajax({
                url: "/idCheck",
                data: {id: id},
                type: "post",
                success: function (response) {
                    if (response.exists) {
                        $("#idChk").html("이미 사용중인 아이디 입니다.");
                    } else {
                        $("#idChk").html("사용가능한 아이디 입니다.");
                    }
                }
            });
        }, 300);
    })

    $('[name=password]').on('keyup', function (event) {
        if (/(?=.*\d{1,50})(?=.*[~`!@#$%\^&*()-+=]{1,50})(?=.*[a-zA-Z]{2,50}).{8,50}$/g.test($('[name=password]').val())) {
            $('.pwChk').html("<i class='bi bi-exclamation-circle'></i>");
        } else {
            $('.pwChk').html("<i class='bi bi-exclamation-circle'></i> 숫자, 특문 각 1회 이상, 영문은 2개 이상 사용하여 8자리 이상 입력");
        }
    });
    $('[name=password_confirm]').focusout(function () {
        var pwd1 = $("[name=password]").val();
        var pwd2 = $("[name=password_confirm]").val();

        if (pwd1 != '' && pwd2 == '') {
            null;
        } else if (pwd1 != "" || pwd2 != "") {
            if (pwd1 == pwd2) {
                $('.pwChkRe').html("비밀번호가 일치합니다.");
            } else {
                $('.pwChkRe').html("비밀번호를 다시 입력해주세요.");
            }
        }
    });
</script>
</html>