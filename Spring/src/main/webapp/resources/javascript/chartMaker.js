function reactClick(select, jsonData){
    let period = {
        '6M' : 4.2,
        '3M' : 8.5,
        '1M' : 25,
        '2W' : 45,
        '1W' : 80
    };

    const selectedId = select.attr("id");
    const selectedValue = period[selectedId];
    if (select.hasClass("on") != true) {
        select.parents('.tab').find('.select').removeClass('on');
    }

    select.addClass("on");
    drawAreaChart(jsonData, 600, 400, 1, selectedValue);
}

function drawAreaChart(jsonData, width, height, num, zoom) {
    let item = document.getElementsByClassName("chart-area")[num];
    let chartId = item.id;
    let stockName = jsonData.name;

    var chartTag = document.querySelector("#" + chartId + ' .tv-lightweight-charts');
    if (chartTag !== null) {
        chartTag.parentNode.removeChild(chartTag);
    }

    setAreaChart(jsonData.data, chartId, width, height, stockName, zoom);
}

function setAreaChart(jsonData, id, width, height, stockName, zoom) {
    var chartElement = document.getElementById(id);
    var legendArea = document.getElementsByClassName("legend-area")[0];
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
            barSpacing: zoom,
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

    let areaSeries = chart.addAreaSeries({
        topColor: '#00848556',
        bottomColor: '#00848504',
        lineColor: '#008485',
        lineWidth: 3,
    });

    areaSeries.setData(jsonData.benefit);
    drawBenchMark(chart, legendArea, jsonData.benchmark);
    drawGoal(chart, legendArea, jsonData);
    tootip(chartElement, legendArea, chart, areaSeries, stockName);
}

function drawBenchMark(chart, legendArea, benchMark) {
    var benchmark = chart.addLineSeries({
        color: '#ff00e1',
        lineWidth: 2,
    });
    benchmark.setData(benchMark);

    var legend = document.querySelector('.bm-legend');
    if (!legend) {
        legend = document.createElement('div');
        legend.className = 'bm-legend';
        legendArea.appendChild(legend);
    }

    setBMLegendText(benchMark[benchMark.length - 1].value, legend, 10);

    chart.subscribeCrosshairMove((param) => {
        const data = param.seriesData.get(benchmark);
        if (!data) {
            setBMLegendText(undefined, legend, 10);
            return
        }
        const value = data.value !== undefined ? data.value : data.close;
        setBMLegendText(value, legend);
    });
}

function drawGoal(chart, legendArea, jsonData) {
    goalData = [];
    for (var i = 0; i < jsonData.benefit.length; i++){
        tmp = {
            time : jsonData.benefit[i]['time'],
            value : jsonData.goal,
        }
        goalData.push(tmp);
    }
    
    var goal = chart.addLineSeries({
        color: '#ffb845',
        lineWidth: 2,
    });
    goal.setData(goalData);

    var legend = document.querySelector('.goal-legend');
    if (!legend) {
        legend = document.createElement('div');
        legend.className = 'goal-legend';
        legendArea.appendChild(legend);
    }

    setGoalLegendText(goalData[goalData.length - 1].value, legend, 10);

    chart.subscribeCrosshairMove((param) => {
        const data = param.seriesData.get(goal);
        if (!data) {
            setGoalLegendText(undefined, legend, 10);
            return
        }
        const value = data.value !== undefined ? data.value : data.close;
        setGoalLegendText(value, legend);
    });
}

function setGoalLegendText(priceValue, legend) {
	let val = '∅';
	if (priceValue !== undefined) {
		val = priceValue;
	}
	legend.innerHTML = `목표수익률 <span class="smaColor20">${val}</span>`;
}

function setBMLegendText(priceValue, legend) {
	let val = '∅';
	if (priceValue !== undefined) {
		val = priceValue;
	}
	legend.innerHTML = `벤치마크 <span class="smaColor10">${val}</span>`;
}

function tootip(chartElement, legendArea, chart, areaSeries, stockName){
    const toolTipWidth = 80;
    const toolTipHeight = 80;
    const toolTipMargin = 15;

    const toolTip = document.createElement('div');
    toolTip.classList.add('tooltip');

    const existingToolTip = legendArea.querySelector('.tooltip');
    // 기존의 toolTip 요소가 있으면 제거
    if (existingToolTip) {
        existingToolTip.remove();
    }

    legendArea.appendChild(toolTip);

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
            toolTip.innerHTML = `<div>${stockName}</div><div style="font-size: 18px; margin: 4px 0px; color: #000000">
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
            toolTip.style.left = shiftedCoordinate -200 + 'px';
            toolTip.style.top = coordinateY -50  + 'px';
        }
    });
}
