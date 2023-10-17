function displayJsonData(url, colOrder) {
    function getHttpRequest(url, callback) {
        var request = new XMLHttpRequest();
        request.onreadystatechange = function (event) {
            if (request.readyState == 4) {
                if (request.status == 200) {
                    // 요청이 정상적으로 처리된 경우
                    console.log("success");
                    callback(request.responseText);
                } else {
                    // 에러가 발생한 경우
                }
            }
        }

        const method = "GET";
        request.open('get', url, true);
        request.send();
    }

    function createTable(obj, colOrder) {
        let table = document.createElement('table');
        table.classList.add("table");
        let i = 1;
        let thead = document.createElement('thead');
        let tbody = document.createElement('tbody');

        obj.forEach(el => {
            let tr = document.createElement('tr');
            colOrder.forEach(col => {
                let td = document.createElement('td');
                if (col === 'image') {
                    td.appendChild(el[col]);
                } else if (col === 'image_src') {
                    td.textContent = i++;
                } else {
                    td.textContent = el[col];
                    if ((col === 'rental_status' || col === 'rent_status') && el[col] === '대출중') {
                        td.classList.add('rental-status-red'); // 대출중인 경우 클래스 추가
                    }
                }
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });

        table.appendChild(tbody);
        return table;
    }

    getHttpRequest(url, function (response) {
        var json = JSON.parse(response);

        for (var object in json) {
            let cover = document.createElement('img');
            cover.src = json[object].image_src;
            json[object].image = cover;
        }
        let table = createTable(json, colOrder);
        document.getElementById('list').appendChild(table);
    });
}

function memberSignIn() {
    document.querySelector("#submit").addEventListener("click", function (event) {
        event.preventDefault();

        var name = document.querySelector("#Mname input").value;
        var birthday = document.querySelector("#Mbirth input").value;
        var address = document.querySelector("#Maddress input").value;
        var phone = document.querySelector("#Mcontact input").value;

        if (!validatePhoneNumber(phone)) {
            alert("올바른 전화번호 형식이 아닙니다. (010-xxxx-xxxx)")
            return;
        }

        if (!validateBirthday(birthday)) {
            alert("올바른 생년월일 형식이 아닙니다. (YYYYMMDD)")
            return;
        }

        if (!validateName(name)) {
            alert("올바른 이름 형식이 아닙니다. (한글만 가능)")
            return;
        }

        phone = formatPhoneNumber(phone);
        birthday = formatBirthday(birthday);
        var currentDate = new Date();
        var age = calculateAge(birthday);

        var member = {
            rent_status: "대출 가능",
            name: name,
            join_date: currentDate.toLocaleString(),
            address: address,
            contact: phone,
            birthday: birthday,
            age: age
        };

        saveMemberInfo(member);
    });

    function validatePhoneNumber(phone) {
        var phoneRegex = /^010-\d{4}-\d{4}$/;
        return phoneRegex.test(phone);
    }

    function validateBirthday(birthday) {
        var birthdayRegex = /^\d{8}$/;
        return birthdayRegex.test(birthday);
    }

    function validateName(name) {
        var nameRegex = /^[가-힣]+$/;
        return nameRegex.test(name);
    }

    function formatPhoneNumber(phone) {
        var formattedPhone = "010-" + phone.substr(0, 4) + "-" + phone.substr(4, 4);
        return formattedPhone;
    }

    function formatBirthday(birthday) {
        var year = birthday.substr(0, 4);
        var month = birthday.substr(4, 2);
        var day = birthday.substr(6, 2);
        var formattedBirthday = year + "-" + month + "-" + day;
        return formattedBirthday;
    }

    function calculateAge(birthday) {
        var birthDate = new Date(birthday);
        var currentDate = new Date();
        var age = currentDate.getFullYear() - birthDate.getFullYear();

        var monthDiff = currentDate.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    }

    function saveMemberInfo(member) {
        alert('JavaScript로 JSON 파일을 수정하는 것은 불가능합니다.');
        window.location.href = 'member.html';
    }    
}