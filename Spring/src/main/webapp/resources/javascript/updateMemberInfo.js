function setUpdateMemberInfoData(){
    var nameInput = document.querySelector('input[name="name"]');
    var phoneInput = document.querySelector('input[name="phone"]');
    var emailInput = document.querySelector('input[name="email"]');
    nameInput.value = userInfo.name;
    phoneInput.value = userInfo.phone;
    emailInput.value = userInfo.email;
}
// 모달 열기 함수
function openModalUpdate() {
    var memberInfoElement = document.getElementById("memberInfo");
    var PasswordElement = document.getElementById("Password");
    var investInfoElement = document.getElementById("investInfo");
    var resignElement = document.getElementById("resign");
    if (memberInfoElement) {
        memberInfoElement.addEventListener("click", function () {
            document.getElementById("memberInfoModal").style.display = "block";
        });
    }
    if (PasswordElement) {
        PasswordElement.addEventListener("click", function () {
            document.getElementById("PasswordModal").style.display = "block";
        });
    }
    if (investInfoElement) {
        investInfoElement.addEventListener("click", function () {
            document.getElementById("investInfoModal").style.display = "block";
        });
    }
    if (resignElement) {
        resignElement.addEventListener("click", function () {
            document.getElementById("resignModal").style.display = "block";
        });
    }
}

// 모달 닫기 함수
function closeModalUpdate() {
    var memberInfoClose = document.getElementById("memberInfoClose");
    var PasswordClose = document.getElementById("PasswordClose");
    var investInfoClose = document.getElementById("investInfoClose");
    var resignClose = document.getElementById("resignClose");
    if (memberInfoClose) {
        memberInfoClose.addEventListener("click", function () {
            document.getElementById("memberInfoModal").style.display = "none";
        });
    }
    if (PasswordClose) {
        PasswordClose.addEventListener("click", function () {
            document.getElementById("PasswordModal").style.display = "none";
        });
    }
    if (investInfoClose) {
        investInfoClose.addEventListener("click", function () {
            document.getElementById("investInfoModal").style.display = "none";
        });
    }
    if (resignClose) {
        resignClose.addEventListener("click", function () {
            document.getElementById("resignModal").style.display = "none";
        });
    }
}

function setUserInfo(userInfo){
    var tables = document.getElementsByClassName("table-wrap");
    var tdList;
    var value;
    var key;
    userInfo['account'] = userInfo['account'].substring(0, 3) + "-" + userInfo['account'].substring(3, 9) + "-" + userInfo['account'].substring(9);
    var joinDate = new Date(userInfo['join_date']);
    var formattedJoinDate = joinDate.getFullYear() + "년 " + (joinDate.getMonth() + 1) + "월 " + joinDate.getDate() + "일";
    userInfo['join_date'] = formattedJoinDate;
    Array.from(tables).forEach(table => {
        tdList = table.querySelectorAll("td");
        tdList.forEach(td => {
            key = td.id;
            value = userInfo[key];
            td.textContent = value + td.textContent;
        });
    });
}