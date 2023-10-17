function openModalAuthentication() {
    var phoneAuthenticationElement = document.getElementById("PhoneAuthentication");
    var emailAuthenticationElement = document.getElementById("EmailAuthentication");
    if (phoneAuthenticationElement) {
        phoneAuthenticationElement.addEventListener("click", function () {
            document.getElementById("authenticationModal").style.display = "block";
        });
    }
    if (emailAuthenticationElement) {
        emailAuthenticationElement.addEventListener("click", function () {
            document.getElementById("authenticationModal").style.display = "block";
        });
    }
}

function closeModalAuthentication() {
    document.getElementById("closeAuthentication").addEventListener("click", function () {
        document.getElementById("authenticationModal").style.display = "none";
    });
}

function signUp(){
    $('#signupForm').submit(function (event) {
        event.preventDefault();

        const id = $('#signupForm input[name="id"]').val();
        const password = $('#signupForm input[name="password_confirm"]').val();
        const name = $('#signupForm input[name="name"]').val();
        const email = $('#signupForm input[name="email"]').val();
        const phoneNumber = $('#signupForm input[name="phone"]').val();

        const data = {
            id: id,
            password: password,
            name: name,
            email: email,
            phoneNumber: phoneNumber,
        };

        $.ajax({
            url: '/insertMember',
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (response) {
                if (response === "회원 등록 성공") {
                    alert("회원 등록 성공");
                    window.location.href = "/investType";
                } else {
                    console.error("회원 등록 실패");
                }
            }
        });
    });
}

function checkVariable(){
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
            $('.pwChk').html("<i class='bi bi-exclamation-circle'></i> 숫자, 특문 각 1회 이상, 영문 2개 이상, 8자리 이상 입력하세요");
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
}

// 이메일 전송 버튼 클릭 시
function sendVerificationEmail() {
    var ePw;
    var email = $('input[name="email"]').val();
    var emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (!emailRegex.test(email)) {
        alert('유효한 이메일 주소를 입력해주세요.');
        return;
    }

    $.ajax({
        url: '/sendEmail',
        type: 'POST',
        data: {email: encodeURI(email)},
        success: function (response) {
            alert('이메일 전송 성공');
            console.log(response);
            ePw = response; // 서버에서 전송된 인증번호 저장
        },
        error: function () {
            alert('이메일 전송 실패');
        }
    });
}

function verifyEmail() {
    var enteredCode = $('input[name="ePw"]').val();
    try {
        if (enteredCode === ePw) {
            alert('인증 성공');
            signUp();
        } else {
            alert('인증 실패');
        }
    } catch(error) {
        alert("이메일 인증을 완료해야 합니다.");
        return;
    }
}

function check_experience() {
    var checkboxes = document.querySelectorAll('input[type="checkbox"]');
    var radios = document.querySelectorAll('input[type="radio"]');
    var checkNoExperience = document.getElementById('check4');

    if (checkNoExperience.checked) {
        checkboxes.forEach(function (checkbox) {
            if (checkbox!=checkNoExperience){
                checkbox.checked = false;
                checkbox.disabled = true;
            }
    });

    radios.forEach(function (radio) {
        radio.checked = false;
        radio.disabled = true;
    });
    } else {
        checkboxes.forEach(function (checkbox) {
            checkbox.disabled = false;
        });

        radios.forEach(function (radio) {
            radio.disabled = false;
        });
    }
}