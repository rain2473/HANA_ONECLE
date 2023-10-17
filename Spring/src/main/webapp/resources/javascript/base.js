function baseFunction() {
    cursorChange();
    linkToPage();
    preventSelectionOnDoubleClick();
    quickSearch();
}

function loadSampleData(sample) {
    return fetch(sample)
        .then(response => response.json())
        .catch(error => {
            console.error('Error loading JSON file:', error);
        });
}

function searchStock() {
    const searchBox = $("#search-box");

    let isin;
    var input = searchBox.val();
    $.ajax({
        url: '/stocksData',
        type: 'GET',
        data: {
            'input': input
        },
        success: function (data) {
            isin = data[0].isin;
            var url = "/trading?isin=" + isin;
            window.location.href = url;
        },
        error: function (data) {
            isin = 'error';
        },
    });
}

function quickSearch() {
    const resultBox = $(".search-result");
    const searchBox = $("#search-box");

    searchBox.on('input', function () {
        var input = searchBox.val();
        $.ajax({
            url: '/stocksData',
            type: 'GET',
            data: {
                'input': input
            },
            success: function (data) {
                var resultHtml = '';
                for (var i = 0; i < data.length; i++) {
                    resultHtml += '<div class = "quickSearch" data-isin=' + data[i].isin + '>' + data[i].name + '</div>';
                }
                resultBox.html(resultHtml).show();
            },
            error: function (data) {
            },
        });
    });

    $(document).on('click', '.search-result div', function () {
        searchBox.val($(this).text());
    });
}

function setOwner(owner){
    var titles = document.getElementsByClassName("ownerTitle");
    Array.from(titles).forEach(title => {
        title.textContent = owner + ' 님의 ' + title.textContent;
    });
}

function linkToPage() {
    $(document).ready(function () {
        $(".link-wrapper").click(function () {
            var url = $(this).data("href");
            try {
                if ((url.indexOf("http") === 0 || url.indexOf("https") === 0) && !(url.indexOf("http://localhost") === 0 || url.indexOf("https://localhost") === 0)) {
                    window.open(url, "_blank");
                } else {
                    window.location.href = url;
                }
            } catch (error) {
            }
        });
    });
}

function cursorChange() {
    document.addEventListener("DOMContentLoaded", function () {
        let arrowElements = document.querySelectorAll(".arrow_backward, .arrow_forward, .link-wrapper, .select, .link-wrapper > p, .link-wrapper > h2, .link-wrapper > .img_wrapper");
        let normalElements = document.querySelectorAll("p, h2, span, div, .darkMatter");

        normalElements.forEach(function (normal) {
            normal.addEventListener("mouseenter", function () {
                normal.style.cursor = "default";
            });
        });

        arrowElements.forEach(function (arrow) {
            arrow.addEventListener("mouseenter", function () {
                arrow.style.cursor = "pointer";
            });

            arrow.addEventListener("mouseleave", function () {
                arrow.style.cursor = "auto";
            });
        });

        
    });
}

function preventSelectionOnDoubleClick() {
    document.addEventListener("mousedown", function (event) {
        if (event.detail > 1) {
            event.preventDefault();
        }
    });
}

function selectedTab() {
    $(document).ready(function () {
        // URL 주소에서 현재 경로를 가져옴
        var currentPath = window.location.pathname;

        // URL 주소를 "/"로 분할하여 경로들을 배열로 만듦
        var pathSegments = currentPath.split('/');

        // 가장 마지막 경로를 가져옴
        var lastSegment = pathSegments[pathSegments.length - 2]; // 마지막 요소는 공백이 될 수 있음

        // 가장 마지막 경로에 해당하는 요소를 변경
        $('#' + lastSegment).css('border', '0.3vw solid #008584');
        $('#' + lastSegment).css('background-color', '#e8ebeb');
    });

}

function onePageScroll(customAnimation = null){
    let pages;
    pages = document.querySelector('.pages');
    if(pages === null){
        pages = document.querySelector('.pagesSignUp');
    }
    const pagination = document.querySelector('.pagination');

    let slides = [],
        btns = [],
        count = 0,
        current = 0,
        touchstart = 0,
        animation_state = false;

    function init() {
        slides = pages.getElementsByClassName("page");
        count = slides.length;
        for(let i = 0; i < count; i++) {
            slides[i].style.bottom = -(i * 100) + '%';
            let btn = document.createElement('li');
            btn.dataset.slide = i;
            btn.addEventListener('click', btnClick);
            btns.push(btn);
            pagination.appendChild(btn);
        }
        btns[0].classList.add('active');
    }

    function gotoNum(index) {
        if((index != current) && !animation_state) {
            animation_state = true;
            setTimeout(() => {animation_state = false;
                if (index === current && customAnimation != null) {
                    customAnimation(index);
                }
            }, 500);
            btns[current].classList.remove('active');
            current = index;
            btns[current].classList.add('active');
            for(let i = 0; i < count; i++) {
                slides[i].style.bottom = (current - i) * 100 + '%';
            }
        }
    }

    const gotoNext = () => current < count - 1 ? gotoNum(current + 1) : false;
    const gotoPrev = () => current > 0 ? gotoNum(current - 1) : false;
    const btnClick = (e) => gotoNum(parseInt(e.target.dataset.slide));
    pages.onmousewheel = pages.onwheel = (e) => e.deltaY < 0 ? gotoPrev() : gotoNext();

    init();
}

function getTodayDate() {
    const today = new Date();

    let Year = today.getFullYear()
        , month = today.getMonth() + 1
        , day = today.getDate()
        , hour = today.getHours()

    if (month < 10) month = '0' + month;
    if (day < 10) day = '0' + day;
    if (hour < 10) hour = '0' + hour;

    return Year + '-' + month + '-' + day + ' ' + hour;
}

function setAngle(id, angle) {
    const section = document.getElementById(id);
    const element = section.querySelector('.arrow');
    element.setAttribute('data-angle', angle);
}

function animateSpeedometer() {
    const elements = document.getElementsByClassName('arrow');
    const duration = 1500;
    
    function animateElement(element, startTime) {
        let currentRotation = -90;
        const targetRotation = element.getAttribute("data-angle");

        function animate(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;

            if (progress < duration) {
                const rotation = currentRotation + (progress / duration) * (targetRotation - currentRotation);
                element.style.transform = `rotate(${rotation}deg)`;
                requestAnimationFrame(animate);
            } else {
                element.style.transform = `rotate(${targetRotation}deg)`;
            }
        }
        requestAnimationFrame(animate);
    }
    for (const element of elements) {
        animateElement(element, null);
    }
}

function setScoreImg(score, type){
    var ScoreCenti = document.getElementById(type + "ScoreCenti");
    var ScoreDeci = document.getElementById(type + "ScoreDeci");
    var ScoreUnit = document.getElementById(type + "ScoreUnit");
    if (score > 99){
        ScoreCenti.innerHTML = `<img src="../../resources/img/score/1_blue.png"/>`
        ScoreDeci.innerHTML = `<img src="../../resources/img/score/0_blue.png"/>`
        ScoreUnit.innerHTML = `<img src="../../resources/img/score/0_blue.png"/>`
    }
    else{
        var color;
        var deci = parseInt(score / 10);
        var unit = score % 10;
        
        if (parseInt(score / 30) === 0){
            color = "red";
        } else if (parseInt(score / 30) === 1){
            color = "yellow";
        } else if (parseInt(score / 30) === 2){
            color = "green";
        } else {
            color = "blue";
        }
        ScoreDeci.innerHTML = `<img src="../../resources/img/score/${deci}_${color}.png"/>`
        ScoreUnit.innerHTML = `<img src="../../resources/img/score/${unit}_${color}.png"/>`
    }
}

function requestRecommend(url) {
    const page1 = document.querySelector("#recommendModelPage");
    const page2 = document.querySelector("#recommendSectorPage");
    const selectedModels = [];
    let sortByModels = "";
    const selectedSectors = [];

    const formData = {
        VOLUME : String(document.getElementById("VOLUME").querySelector("input").value),
        UPDOWN : String(document.getElementById("UPDOWN").querySelector("input").value),
        EPS : String(document.getElementById("EPS").querySelector("input").value),
        PBR : String(document.getElementById("PBR").querySelector("input").value),
        PER : String(document.getElementById("PER").querySelector("input").value),
    };

    const selectedModelElements = page1.querySelectorAll(".on");
    selectedModelElements.forEach(function (element) {
        const dataValue = element.getAttribute("data-sector");
        if (dataValue != null){
            selectedModels.push(dataValue);
        }
    });

    if (selectedModels.length == 2){
        sortByModels = "TOTAL_SCORE"
    } else {
        sortByModels = selectedModels[0] + "_SCORE"
    } 

    const selectedSectorsElements = page2.querySelectorAll(".on");
    selectedSectorsElements.forEach(function (element) {
        const dataValue = element.getAttribute("data-sector");
        if (dataValue != null){
            selectedSectors.push(dataValue);
        }
    });

    selectedSectors.sort();
    const requestData = {
        sortByModels: sortByModels,
        selectedSectors: selectedSectors,
        formData: formData,
    };

    $.ajax({
        type: "POST",
        url: url,
        data: JSON.stringify(requestData),
        contentType: "application/json",
        success: function (response) {
            var queryParams = $.param(response);
            window.location.href = "/recommendResult?" + queryParams;
        },
        error: function (error) {
        },
    });
}

function requestQuickRecommend(url) {
    $.ajax({
        type: "POST",
        url: url,
        data: JSON.stringify(),
        contentType: "application/json",
        success: function (response) {
            var queryParams = $.param(response);
            window.location.href = "/recommendResult?" + queryParams;
        },
        error: function (error) {
        },
    });
}

function parseQueryParams() {
    var currentURL = window.location.href;
    var query = currentURL.substring(currentURL.indexOf('?') + 1);
    var queryParams = query.split('&');
    var result = [];
    var tmp = {};

    for (var i = 0; i < queryParams.length; i++) {
        var param = queryParams[i].split('=');
        var key = decodeURIComponent(param[0]);
        var value = decodeURIComponent(param[1]);
        tmp[key] = value;
    }

    for (var i = 0; i < 5; i++) {
        var item = {
            "name": tmp["recommend[" + i + "][name]"],
            "isin": tmp["recommend[" + i + "][isin]"],
            "rank": tmp["recommend[" + i + "][rank]"]
        };

        result.push(item);
    }

    return {"recommend": result};
}