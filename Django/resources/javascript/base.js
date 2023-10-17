function baseFunction() {
    cursorChange();
    linkToPage();
    preventSelectionOnDoubleClick();
    scrollTopFixed();
    selectedTab();
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
        let arrows = document.querySelectorAll(".arrow_backward, .arrow_forward, .link-wrapper, .select, .link-wrapper > p, .link-wrapper > .img_wrapper");
        let normal = document.querySelectorAll("p, h2, span, div");

        normal.forEach(function (normal) {
            normal.addEventListener("mouseenter", function () {
                normal.style.cursor = "default";
            });
        });

        arrows.forEach(function (arrow) {
            arrow.addEventListener("mouseenter", function () {
                arrow.style.cursor = "pointer";
            });

            arrow.addEventListener("mouseleave", function () {
                arrow.style.cursor = "auto";
            });
        });

        
    });
}

function scrollTopFixed() {
    document.addEventListener("DOMContentLoaded", function () {
        document.querySelector("#top_button")
            .addEventListener("click", function () {
                window.scrollTo(0, 0);
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

function onePageScroll(pages, pagination){
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
            btn.addEventListener('click', btnClick)
            btns.push(btn);
            pagination.appendChild(btn);
        }
        btns[0].classList.add('active');
    }

    function gotoNum(index) {
        if((index != current) && !animation_state) {
            animation_state = true;
            setTimeout(() => animation_state = false, 500);
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