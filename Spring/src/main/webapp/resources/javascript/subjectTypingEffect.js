function disableStyle(selector) {
    const subjectElement = document.querySelector(selector);
    subjectElement.classList.add("disable-after");
}

function typingSubject(letters, selector, exec) {
    const $text = document.querySelector(selector);
    const speed = 75;
    let i = 0;

    if ($text === null){
        return null;
    }

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
            setTimeout(deleteLogoPage, 500, exec);
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

    const deleteLogoPage = (exec) => {
        if (exec!=0){
            // id가 "logo"인 div 요소를 찾습니다.
            const logoDiv = document.getElementById("logo");

            // logoDiv가 존재하면 삭제합니다.
            if (logoDiv) {
            logoDiv.parentNode.removeChild(logoDiv);
            }
        }
    }

    setTimeout(typing, 1500);
}