function disableStyle(selector) {
    const subjectElement = document.querySelector(selector);
    subjectElement.classList.add("disable-after");
}

function typingSubject(letters, selector, scroll) {
    const $text = document.querySelector(selector);
    const speed = 75;
    let i = 0;

    const typing = async () => {
        const letter = changeLineBreak(letters[i].split(""));

        while (letter.length) {
            await wait(speed);
            $text.innerHTML += letter.shift();
        }
        await wait(800);
        if (letters[i + 1]) {
            remove();
        }
        else {
            disableStyle("#subject");
            setTimeout(scrollToBottom, 500);
        }
    }

    const remove = async () => {
        const letter = letters[i].split("");

        while (letter.length) {
            await wait(speed);
            letter.pop();
            $text.innerHTML = letter.join("");
        }
        i++;
        typing();
    }

    function wait(ms) {
        return new Promise(res => setTimeout(res, ms));
    }

    const changeLineBreak = (letter) => {
        return letter.map(text => text === "\n" ? "<br>" : text);
    }

    const scrollToBottom = () => {
        const startPosition = window.scrollY;
        const targetPosition = scroll;
        const distance = targetPosition - startPosition;
        const duration = 500; // 원하는 스크롤 시간 (밀리초)
        const startTime = performance.now();

        function scrollStep(timestamp) {
            const currentTime = timestamp - startTime;
            const scrollFraction = currentTime / duration;
            const scrollValue = startPosition + distance * easeInOutQuad(scrollFraction);

            window.scrollTo(0, scrollValue);

            if (currentTime < duration) {
                requestAnimationFrame(scrollStep);
            }
        }

        function easeInOutQuad(t) {
            return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        }

        requestAnimationFrame(scrollStep);
    }

    setTimeout(typing, 1500);
}