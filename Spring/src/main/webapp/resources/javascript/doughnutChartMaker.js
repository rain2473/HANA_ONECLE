function drawDoughnutData(jsonData) {
    const doughnut = document.getElementById('doughnutChart');
    const chartData = {
        plugins:[ChartDataLabels],
        datasets: [{
            data: jsonData.map(item => item.price)
        }],
        labels: jsonData.map(item => [item.name])
    };
    const chart = {
        type: 'doughnut',
        data: chartData,
        options: {
            responsive: false,
            plugins: {
                legend:{
                    position: 'bottom',
                },
                title: {
                    display: false,
                }
            }
        },
    };
    new Chart(doughnut, chart);
}

function hideDoughnutData(chart, num){
    chart.hide(0, num);
}

function showDoughnutData(chart, num){
    chart.show(0, num);
}
