function loadJsonData() {
    return fetch(rollingbanner)
        .then(response => response.json()) // Response 데이터를 JSON으로 변환
        .then(data => {
            const bannerList = document.getElementById('banner-list');
            data.forEach(index => {
                const li = createBannerItem(index);
                bannerList.appendChild(li);
            });
        })
        .catch(error => {
            console.error('Error fetching JSON:', error);
        });
}

function createBannerItem(index) {
    const li = document.createElement('li');
    const pre = document.createElement('pre');
    pre.textContent = `${index.name} : ${index.last} (${index.sign}${index.rate})%`;

    const span = document.createElement('span');
    if (index.sign === '-'){
        span.className = 'status down';
    }else{
        span.className = 'status up';
    }

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'ionicon');
    svg.setAttribute('viewBox', '0 0 512 512');

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('class', 'arrow-path');
    path.setAttribute('d', 'M268 112l144 144-144 144M392 256H100');

    svg.appendChild(path);
    span.appendChild(svg);

    li.appendChild(pre);
    li.appendChild(span);

    return li;
}

function copyAndMove() {
    const rollerWidth = document.querySelector('.roller ul').offsetWidth;
    const betweenDistance = 1;
    const roller = document.querySelector('.roller');
    const clone = roller.cloneNode(true);

    roller.id = 'roller1';
    clone.id = 'roller2';
    
    document.querySelector('.wrap').appendChild(clone);

    const roller1 = document.querySelector('#roller1');
    const roller2 = document.querySelector('#roller2');

    document.querySelector('#roller1').style.left = '0px';
    document.querySelector('#roller2').style.left = rollerWidth + 'px';

    const originalID = window.setInterval(betweenRollCallback, parseInt(1000 / 100), betweenDistance, roller1);
    const cloneID = window.setInterval(betweenRollCallback, parseInt(1000 / 100), betweenDistance, roller2);

    function betweenRollCallback(d, roller) {
        let left = parseInt(roller.style.left);
        roller.style.left = (left - d) + 'px';
        if (rollerWidth + (left - d) <= 0) {
            roller.style.left = 2 * rollerWidth + (left - d) + 'px';
        }
    }
}

async function rollingBanner() {
    await loadJsonData();
    copyAndMove();
}
