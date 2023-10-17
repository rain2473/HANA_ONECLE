function drawCandleChart(jsonData, width, height) {
    let item = document.getElementsByClassName("chart-area")[0];
    let chartId = item.id;
    let stockName = jsonData.name;

    var chartTag = document.querySelector("#" + chartId + ' .tv-lightweight-charts');
    if (chartTag !== null) {
        chartTag.parentNode.removeChild(chartTag);
    }

    setCandleChart(jsonData.data, chartId, width, height, stockName);
}

function setCandleChart(jsonData, id, width, height, stockName) {
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
            barSpacing: 13.5,
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

    let candleSeries = chart.addCandlestickSeries({
        upColor: '#ff0000',
        downColor: '#2175ff',
        borderDownColor: '#2175ff',
        borderUpColor: '#ff0000',
        wickDownColor: '#2175ff',
        wickUpColor: '#ff0000',
    });

    candleSeries.setData(jsonData);
    tootipCandle(chartElement, legendArea, chart, candleSeries, stockName);
    drawSMA(chart, legendArea, jsonData);
}

function drawSMA(chart, legendArea, jsonData) {
    var smaData10 = calculateSMA(jsonData, 10);
    var smaData20 = calculateSMA(jsonData, 20);
    var smaData60 = calculateSMA(jsonData, 60);
    var smaLine10 = chart.addLineSeries({
        color: '#ff00e1',
        lineWidth: 2,
    });
    var smaLine20 = chart.addLineSeries({
        color: '#ffb845',
        lineWidth: 2,
    });
    var smaLine60 = chart.addLineSeries({
        color: '#15ff00',
        lineWidth: 2,
    });
    smaLine10.setData(smaData10);
    smaLine20.setData(smaData20);
    smaLine60.setData(smaData60);

    var legend10 = document.createElement('div');
    legend10.className = 'sma-legend';
    legendArea.appendChild(legend10);

    var legend20 = document.createElement('div');
    legend20.className = 'sma-legend';
    legendArea.appendChild(legend20);

    var legend60 = document.createElement('div');
    legend60.className = 'sma-legend';
    legendArea.appendChild(legend60);

    setLegendText(smaData10[smaData10.length - 1].value, legend10, 10);
    setLegendText(smaData20[smaData20.length - 1].value, legend20, 20);
    setLegendText(smaData60[smaData60.length - 1].value, legend60, 60);

    chart.subscribeCrosshairMove((param) => {
        const data10 = param.seriesData.get(smaLine10);
        if (!data10) {
            setLegendText(undefined, legend10, 10);
            return
        }
        const price10 = data10.value !== undefined ? data10.value : data10.close;
        setLegendText(price10, legend10, 10);
    });

    chart.subscribeCrosshairMove((param) => {
        const data20 = param.seriesData.get(smaLine20);
        if (!data20) {
            setLegendText(undefined, legend20, 20);
            return
        }
        const price20 = data20.value !== undefined ? data20.value : data20.close;
        setLegendText(price20, legend20, 20);
    });

    chart.subscribeCrosshairMove((param) => {
        const data60 = param.seriesData.get(smaLine60);
        if (!data60) {
            setLegendText(undefined, legend60, 60);
            return
        }
        const price60 = data60.value !== undefined ? data60.value : data60.close;
        setLegendText(price60, legend60, 60);
    });
}

function setLegendText(priceValue, legend, days) {
	let val = '∅';
	if (priceValue !== undefined) {
		val = priceValue;
	}
	legend.innerHTML = `이동평균선(${days}) <span class="smaColor${days}">${val}</span>`;
}

function calculateSMA(data, count){
    var avg = function(data) {
        var sum = 0;
        for (var i = 0; i < data.length; i++) {
            sum += Number(data[i].close);
        }
        return parseInt(sum / data.length);
    };
    var result = [];
    for (var i=count - 1, len=data.length; i < len; i++){
        var val = avg(data.slice(i - count + 1, i));
        result.push({ time: data[i].time, value: val});
    }
    return result;
}

function tootipCandle(chartElement, legendArea, chart, areaSeries, stockName) {
    const tootipCandleWidth = 80;
    const tootipCandleHeight = 80;
    const tootipCandleMargin = 15;

    const tootipCandle = document.createElement('div');
    tootipCandle.classList.add('tootipCandle');

    const existingtootipCandle = legendArea.querySelector('.tootipCandle');
    // 기존의 toolTip 요소가 있으면 제거
    if (existingtootipCandle) {
        existingtootipCandle.remove();
    }

    legendArea.appendChild(tootipCandle);

    chart.subscribeCrosshairMove(param => {
        if (
            param.point === undefined ||
            !param.time ||
            param.point.x < 0 ||
            param.point.x > chartElement.clientWidth ||
            param.point.y < 0 ||
            param.point.y > chartElement.clientHeight
        ) {
            tootipCandle.style.visibility = 'hidden';
        } else {
            const data = param.seriesData.get(areaSeries);
            const dateStr = data.time;
            tootipCandle.style.visibility = 'visible';
            const price = data.value !== undefined ? data.value : data.close;
            const close = data.close;
            const open = data.open;
            const high = data.high;
            const low = data.low;
            tootipCandle.innerHTML = `<h2>${stockName}</h2><div style="margin: 4px 0px; color: #000000">
                시가 : ${Math.round(100 * open) / 100} <br/>
                고가 : ${Math.round(100 * high) / 100} <br/>
                저가 : ${Math.round(100 * low) / 100} <br/>
                종가 : ${Math.round(100 * close) / 100}
                </div><p>
                ${dateStr}
                </p>`;
            const coordinate = areaSeries.priceToCoordinate(price);
            let shiftedCoordinate = param.point.x - 50;
            if (coordinate === null) {
                return;
            }
            shiftedCoordinate = Math.max(
                0,
                Math.min(chartElement.clientWidth - tootipCandleWidth, shiftedCoordinate)
            );
            const coordinateY =
                coordinate - tootipCandleHeight - tootipCandleMargin > 0
                    ? coordinate - tootipCandleHeight - tootipCandleMargin
                    : Math.max(
                        0,
                        Math.min(
                            chartElement.clientHeight - tootipCandleHeight - tootipCandleMargin,
                            coordinate + tootipCandleMargin
                        )
                    );
            tootipCandle.style.left = shiftedCoordinate + 'px';
            tootipCandle.style.top = coordinateY -50 + 'px';
        }
    });
}