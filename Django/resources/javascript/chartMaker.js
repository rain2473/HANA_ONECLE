function drawChartData(jsonData, id, width, height, type) {
    var chartElement = document.getElementById(id);
    var chart = LightweightCharts.createChart(chartElement, {
        width: width,
        height: height,
        rightPriceScale: {
            visible: true,
            borderColor: '#e8ebeb',
        },
        leftPriceScale: {
            visible: false,
        },
        timeScale: {
            visible: true,
            borderColor: '#e8ebeb',
            barSpacing: 20,
        },
        layout: {
            background: {
                type: 'solid',
                color: '#fafbfb',
            },
            lineColor: '#e8ebeb',
            textColor: '#22222270',
        },
        grid: {
            vertLines: {
                color: '#e8ebeb',
            },
            horzLines: {
                color: '#e8ebeb',
            },
        },
        crosshair: {
            vertLine: {
                labelVisible: false,
            },
            horzLine: {
                labelVisible: false,
            },
        },
        handleScroll: {
            vertTouchDrag: false,
        },
    });

    var areaSeries = chart.addAreaSeries({
        topColor: '#00848556',
        bottomColor: '#00848504',
        lineColor: '#008485',
        lineWidth: 3,
    });
    
    areaSeries.setData(jsonData);
    tootip(chartElement, chart, areaSeries, type);
}

function handleSelectClick(type, width, height) {
    if ($(this).hasClass("on") === true) {
        return;
    }

    let item = $(this).parents('.item');

    item.find('.select').removeClass('on');
    $(this).addClass("on")

    let chartId = item.find('.chart-area').attr('id');
    let seletionID = $(this).attr('id');

    var chartData = decideChartType(chartId, seletionID, type);

    var chartTag = document.querySelector("#" + chartId + ' .tv-lightweight-charts');
    if (chartTag !== null) {
        chartTag.parentNode.removeChild(chartTag);
    }

    drawChartData(chartData, chartId, width, height, seletionID);
}

function tootip(chartElement, chart, areaSeries, type){
    const toolTipWidth = 80;
    const toolTipHeight = 80;
    const toolTipMargin = 15;

    const toolTip = document.createElement('div');
    toolTip.classList.add('tooltip');

    const existingToolTip = chartElement.querySelector('.tooltip');
    // 기존의 toolTip 요소가 있으면 제거
    if (existingToolTip) {
        existingToolTip.remove();
    }

    chartElement.appendChild(toolTip);

    chart.subscribeCrosshairMove(param => {
        if (
            param.point === undefined ||
            !param.time ||
            param.point.x < 0 ||
            param.point.x > chartElement.clientWidth ||
            param.point.y < 0 ||
            param.point.y > chartElement.clientHeight
        ) {
            toolTip.style.visibility = 'hidden';
        } else {
            const data = param.seriesData.get(areaSeries);
            let dateStr = data.time;
            if(dateStr.substr(dateStr.length - 1, dateStr.length)==="-"){
                dateStr = dateStr.substr(0, dateStr.length - 1);
            }
            toolTip.style.visibility = 'visible';
            const price = data.value !== undefined ? data.value : data.close;
            toolTip.innerHTML = `<div>${type}</div><div style="font-size: 18px; margin: 4px 0px; color: ${'black'}">
                ${Math.round(100 * price) / 100}
                </div><div>
                ${dateStr}
                </div>`;

            const coordinate = areaSeries.priceToCoordinate(price);
            let shiftedCoordinate = param.point.x - 50;
            if (coordinate === null) {
                return;
            }
            shiftedCoordinate = Math.max(
                0,
                Math.min(chartElement.clientWidth - toolTipWidth, shiftedCoordinate)
            );
            const coordinateY =
                coordinate - toolTipHeight - toolTipMargin > 0
                    ? coordinate - toolTipHeight - toolTipMargin
                    : Math.max(
                        0,
                        Math.min(
                            chartElement.clientHeight - toolTipHeight - toolTipMargin,
                            coordinate + toolTipMargin
                        )
                    );
            toolTip.style.left = shiftedCoordinate + 'px';
            toolTip.style.top = coordinateY -chartElement.clientHeight + 'px';
        }
    });
}

function decideChartType(chartId, seletionID, type) {
    if (type === "dual") {
        if (chartId === "chartArea1") {
            return national[seletionID];
        } else {
            return international[seletionID];
        }
    } else {
        return items[seletionID];
    }
}

function setDefault() {
    $(this).find(".select").eq(0).trigger("click");
}