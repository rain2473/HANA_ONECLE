// 모달 열기 함수
function openModalLogin() {
    var openLogInElement = document.getElementById("openLogIn");
    var openLogInHeaderElement = document.getElementById("openLogIn-header");
    if (openLogInElement) {
        openLogInElement.addEventListener("click", function () {
            document.getElementById("logInModal").style.display = "block";
        });
    }
    if (openLogInHeaderElement) {
        openLogInHeaderElement.addEventListener("click", function () {
            document.getElementById("logInModal").style.display = "block";
        });
    }
}

// 모달 닫기 함수
function closeModalLogin() {
    document.getElementById("closeLogIn").addEventListener("click", function () {
        document.getElementById("logInModal").style.display = "none";
    });
}

// 로그인
function loginFormFunc() {
    var formData = $("#loginForm").serialize();
    var id = $("#username").val();
    var password = $("#password").val();

    $.ajax({
        type: "POST",
        url: "/loginMember",
        data: JSON.stringify({
            id: id,
            password: password
        }),
        contentType: 'application/json',
        error: function (xhr, status, error) {
            alert(error + "error");
        },
        success: function (response) {
            if (response === "로그인 성공") {
                alert(`로그인 성공`);
                var link = document.createElement("a");
                link.href = "/";
                link.click();
            } else {
                console.error("로그인 실패");
            }
        }
    });
}