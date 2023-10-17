function showRecommends(jsonData){
    let container = document.querySelector(".recommendResultContainer");
    let recommends = jsonData.recommend;
    let target;

    recommends.forEach(recommend => {
        target = container.querySelector("#"+recommend.rank);
        target.innerHTML = `<div class = 'link-wrapper select' data-href="/trading?isin=${recommend.isin}">
        <p>${recommend.name}</p>
        <img src="../../../resources/img/logo/${recommend.isin}.png" /></div>`;
    });
}

function preventNullSelection(wrapper) {
    let selections = wrapper.querySelectorAll(".on").length;
    let selectables = wrapper.querySelectorAll(".select");

    if (selections === 0) {
        alert("하나 이상의 모델을 선택하세요!\n기본 설정(전부 선택)으로 변경됩니다!");
        Array.from(selectables).forEach(selectable => {
            selectable.classList.add("on");
        })
    }
}

function selectRecommendOption(){
    let selectables = document.querySelectorAll(".select");

    Array.from(selectables).forEach(function (selectable) {
        selectable.addEventListener("click", function () {
            if (!selectable.classList.contains("on")) {
                selectable.classList.add("on");
            } else {
                selectable.classList.remove("on");
            }
        });
    });
}

function rangeSlide(){
    const sliders = document.getElementsByClassName("slider");
    var input;

    Array.from(sliders).forEach(slider => {
        if (slider) {
            var input = slider.querySelector(".input-left");
            input.addEventListener("input", function(e) {
                setSlideValue(slider, e);
            });
        }
    });
}

function setSlideValue(slider, e){
    const sliderContainer = slider.closest(".sliderContainer");
    const thumb = slider.querySelector(".thumb.left");
    const range = slider.querySelector(".range");
    const display = sliderContainer.querySelector(".rangeDisplay");
    const _this = e.target;
    const { value, min, max } = _this;
    const percent = ((+_this.value - +min) / (+max - +min)) * 100;

    thumb.style.left = `calc(calc(40vw - 1rem) * (${percent}) / 100)`;
    range.style.left = `calc(40vw * (${percent}) / 100)`;
    range.style.width = `calc(40vw * (100 - ${percent}) / 100)`;
    display.textContent = `상위 ${(100 - _this.value)}% 이상`;
}

function handleOptionsButton() {
    const marketContainers = document.getElementsByClassName("recommendSectorContainer");
    Array.from(marketContainers).forEach(function (marketContainer) {
        const marketButton = marketContainer.querySelector(".img_wrapper.market");
        const selectButtons = marketContainer.querySelectorAll(".link-wrapper.select");
        let isMarketSelected = true;

        marketButton.addEventListener("click", function () {
            isMarketSelected = !isMarketSelected;

            selectButtons.forEach(function (button) {
                if (isMarketSelected) {
                    button.classList.add("on");
                } else {
                    button.classList.remove("on");
                }
            });
        });
    });
}