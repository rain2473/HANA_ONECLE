function changeBanner() {
    const numOfImgs = 5;
    let intervalId;
    let img = document.querySelector("#ad .img_wrapper img");
    let src = img.getAttribute("src");
    let n = parseInt(src.match(/\d+/)[0]);

    function changeImage(direction) {
        if (direction === "forward") {
            n = (n % numOfImgs) + 1;
        } else if (direction === "backward") {
            n = (n + numOfImgs - 2) % numOfImgs + 1;
        }

        src = src.replace(/\d+/, n);
        img.setAttribute("src", src);
    }

    function startInterval() {
        intervalId = setInterval(() => changeImage("forward"), 5000);
    }

    document.addEventListener("DOMContentLoaded", function () {
        let backward = document.querySelector(".arrow_backward");
        let forward = document.querySelector(".arrow_forward");

        backward.addEventListener("click", function () {
            changeImage("backward");
            clearInterval(intervalId);
            startInterval();
        });

        forward.addEventListener("click", function () {
            changeImage("forward");
            clearInterval(intervalId);
            startInterval();
        });
    });

    startInterval();
}