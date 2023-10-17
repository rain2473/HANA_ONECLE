function clickHandler(element, opposite) {
    element.addEventListener('click', () => {
        type = element.getAttribute('data-type');
        if (!element.classList.contains('on')) {
            element.classList.add('on');
            opposite.classList.remove('on');
        }
        setTypeAndDrow();
    });
}

function setTypeAndDrow() {
    if (type === "exchange") {
        data = exchange;
    } else {
        data = market;
    }
    drowWorldMap();
}

function drowWorldMap(){
    anychart.onDocumentReady(function () {
        // add html elements in div#container
        var container = document.getElementById('map-container');
        container.innerHTML =
            '<div class="chart-area"><div id="mapArea"></div></div>';
        // create map chart
        var map = anychart.map();

        // world.js에서 전세계 지도 추출
        map.geoData('anychart.maps.world');
        
        // 우측 하단 anychart 링크 삭제(라이센스 없으면 무조건 나옴)
        map
        .credits()
        .enabled(false);

        // 지도 백그라운드 
        map.background().fill('#dde9f5');

        // 제목 설정
        map
        .title()
        .enabled(false);

        // 지도 위/경도선 표시(디폴트 false)
        map.crosshair(false);

        // 지도 위/경도 구하기
        map.listen('click', function(evt){
            let localCord = map.globalToLocal(evt.clientX, evt.clientY);
            let latLong = map.inverseTransform(localCord.x, localCord.y);
            console.log(latLong.lat, latLong.long, localCord.x, localCord.y);
        });

        // 지도 확대
        // let zoomController = anychart.ui.zoom();
        // zoomController.render(map);
        
        // 지도영역 설정
        map.container('mapArea');
        
        map.draw();
        
        const getMarkerData = function(data){
            var option;
            if (type === "market"){
                option = "Stock";
            } else {
                option = "Currencies";
            }

            $.each(data, function(idx, val){
                if(val.isMap == false){
                    return;
                }
                
                var leftValue = (parseFloat(val.left) - 145) * 1.04 / 515 * 35;
                var topValue = (parseFloat(val.top) * 1.07 + 160) / 1323 * 87;
                
                let html = '\
                <div class="chart-marker-label-wrap '+val.class+' '+(val.dClass ? val.dClass : '')+'" style="width:14vw; left:'+leftValue+'vw; top:'+topValue+'vw;'+(val.style ? val.style : '')+'" data-left="'+leftValue+'">\
                        <div class="chart-marker-inner">\
                            <a href="'+val.url+'" class="chart-marker-label">\
                                <div class="country-img">\
                                    <img src="//static.hankyung.com/img/www/w/datacenter/country/'+val.img+'.svg" alt="'+val.name+'">\
                                </div>\
                                <div class="label">\
                                    <span class="ellip">'+val.name+'</span>\
                                </div>\
                                <div class="stock-nums">\
                                '+(
                                    option == 'Currencies'
                                    ? 
                                    '<strong class="price" style="display:none;">'+val.last+'</strong>\
                                    <span class="unit" style="display:none;">원/'+val.unit+'</span>\
                                    <span class="rate">'+val.sign+val.rate+'%</span>'
                                    : 
                                    '<strong class="price" style="display:none;">'+val.last+'</strong>\
                                    <span class="rate">'+val.sign+val.rate+'%</span>'
                                )+'\
                                </div>\
                            </a>\
                        </div>\
                    </div>\
                ';

                $("#mapArea").after(html);
            });
        }
        
        getMarkerData(data);

        // 증시 마우스 오버 시 등락률 숨김 + 종가 보여주기
        $(document).on("mouseover", "#map-container .chart-area .chart-marker-label-wrap a", function(){
            $(this).find(".price").show();
            $(this).find(".unit").show();
            $(this).find('.rate').hide();
        });

        $(document).on("mouseout", "#map-container .chart-area .chart-marker-label-wrap a", function(){
            $(this).find(".price").hide();
            $(this).find(".unit").hide();
            $(this).find('.rate').show();
        });

    });
}
