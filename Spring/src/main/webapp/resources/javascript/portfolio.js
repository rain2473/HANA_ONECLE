function setAccountInfo(account){
    var accountTable = document.getElementById("MyAccount");
    account['account'] = String(account['account'])
    account['account'] = account['account'].substring(0, 3) + "-" + account['account'].substring(3, 9) + "-" + account['account'].substring(9);
    var value;
    var td;
    var key;
    Array.from(accountTable.children).forEach(row => {
        td = row.querySelector("td")
        key = td.id;
        if (key === "total"){
            value = Intl.NumberFormat().format(Number(account['received']) + Number(account['valuation']));
        } else if(key === "P&L"){
            value = Intl.NumberFormat().format(Number(account['profit']) + Number(account['valuation']) - Number(account['buy']));
        } else if (key === "account"){
            value = account[key];
        } else {
            value = Intl.NumberFormat().format(account[key]);
        }
        td.textContent = value + " " +td.textContent;
    });
}

function setReturnRate(data){
    var benefitTable = document.getElementById("Mybenefit");
    var td;
    var target, returnRate, value;
    Array.from(benefitTable.children).forEach(row => {
        td = row.querySelector("td")
        if (td.id === "returnRate"){
            value = data.benefit[data.benefit.length - 1].value;
            returnRate = value;
        } else {
            value = data.goal;
            target = value;
        }
        td.textContent = value + "%";
    });
    return Math.min((returnRate / target).toFixed(2), 1) * 100;
}

function setExpectedRate(data){
    var benefitTable = document.getElementById("Onecle");
    var td;
    var target, returnRate, value;
    Array.from(benefitTable.children).forEach(row => {
        td = row.querySelector("td")
        if (td.id === "expectedRate"){
            value = data.expected;
            returnRate = value;
        } else {
            value = data.goal;
            target = value;
        }
        td.textContent = value + "%";
    });
    return Math.min((returnRate / target).toFixed(2), 1) * 100;
}

function updateJsonPercentage(jsonData){
    let totalAsset = 0;
    jsonData.forEach(function(item){
        totalAsset += Number(item.price);
    });
    return totalAsset;
}

function executeDeposit(){
    let deposit = document.querySelector('#deposit');
    let action;
    let inout;
    if (deposit.classList.contains('on')) {
        action = "입금";
    } else {
        action = "출금";
    }

    let amountInput = document.querySelector('input[name="action"]');
    let withdrawalAbleInput = document.querySelector('input[name="withdrawalAble"]');
    let amount = parseInt(amountInput.value);
    let withdrawalAble = parseInt(withdrawalAbleInput.value);

    if (isNaN(amount)) {
        alert("올바른 금액을 입력하세요.");
        return;
    }

    if (action === "출금") {
        if (withdrawalAble >= amount) {
            inout = 1;
        } else {
            alert("출금 가능 금액 이상의 금액은 출금 불가능합니다.");
            return;
        }
    }else{
        inout = 0;
    }
    
    $.ajax({
        type: "POST",
        url: "/depositTransaction",
        data: JSON.stringify({
            amount: amount,
            inout: inout
        }),
        contentType: 'application/json',
        error: function (xhr, status, error) {
            alert(error + "error");
        },
        success: function (response) {
            $("#depositModal .portfolioContainer .buttonSet #depositClose").click()
            if (response === "success") {
                alert(action + " 성공");
            } else {
                alert(action + " 실패");
            }
        }
    });
}

function showRebalancedTable(target, jsonData){
    data =jsonData.rebalanced
    let newStock = {
        name : jsonData.buy[0]['name'],
        diff : jsonData.goal,
        new_value : jsonData.buy[0]['amount'],
        new_portion : 10,
    }
    let cash = {
        name : '현금',
        diff : 0,
        new_value : jsonData.cash,
        new_portion : 10,
    }
    jsonData.sell.forEach(function(item){
        cash.new_value += item.amount;
    });
    jsonData.buy.forEach(function(item){
        cash.new_value -= item.amount;
    });
    data.push(newStock);
    data.push(cash);
    data.sort((a, b) => b.new_value - a.new_value);
    let totalAsset = 0;
    data.forEach(function(item){
        totalAsset += Number(item.new_value);
    });
    let expectedRate = 0
    let rebalanced = document.getElementById(target);

    data.forEach(function(item){
        var portion = (Number(item.new_value) * 100 / totalAsset).toFixed(1);
        var newLine = document.createElement('tr');
        newLine.className = 'assetData ' + item.name;
        newLine.innerHTML = '<td class="assetName">'+item.name+'</td>' +
        '<td class="assetPrice">' + Intl.NumberFormat().format(item.new_value) + ' 원</td>' +
        '<td class="assetPercentage">' + portion + '%</td>';
        rebalanced.appendChild(newLine);
        expectedRate += (item.new_portion * item.diff)
    });

    expectedRate = Math.round(expectedRate)/100;
    total = totalAsset -cash.new_value;
    return [expectedRate, total];
}

function showDataTable(target, jsonData){
    let totalAsset = updateJsonPercentage(jsonData);
    let myAsset = document.getElementById(target);

    jsonData.forEach(function(item){
        item.percentage = (Number(item.price) * 100 / totalAsset).toFixed(1);
        var newLine = document.createElement('tr');
        newLine.className = 'assetData ' + item.name;
        newLine.innerHTML = '<td class="assetName">'+item.name+'</td>' +
        '<td class="assetPrice">' + Intl.NumberFormat().format(item.price) + ' 원</td>' +
        '<td class="assetPercentage">' + item.percentage + '%</td>';
        myAsset.appendChild(newLine);
    });
}

function showDepositListTable(jsonData){
    let MyDeposit = document.getElementById('MyDeposit');
    let inout;

    jsonData.forEach(function(item){
        if (item.inout === 1){
            inout = "출금";
        }
        else{
            inout = "입금";
        }
        var newLine = document.createElement('tr');
        newLine.className = 'depositData ' + item.dep_dt;
        newLine.innerHTML = '<td class="depositDate">'+item.dep_dt+'</td>' +
        '<td class="depositAmount">' + Intl.NumberFormat().format(item.amount)+ ' 원</td>' +
        '<td class="depositInput">' + inout + '</td>' + 
        '<td class="depositBalance">' + Intl.NumberFormat().format(item.total_deposit) + ' 원</td>';
        MyDeposit.appendChild(newLine);
    });
}

function showOrderListTable(jsonData){
    let MyOrder = document.getElementById('MyOrder');
    let o_type, o_result;

    jsonData.forEach(function(item){
        item.amount = item.order_price * item.order_volume;
        o_type = item.order_type === 1 ? "매도" : "매수"
        o_result = item.order_result ===1 ? "채결" : "미채결"
        var newLine = document.createElement('tr');
        newLine.innerHTML = '<td class="orderDate">'+item.work_dt+'</td>' +
        '<td class="orderStock">' + item.name + '</td>' +
        '<td class="orderPrice">' + Intl.NumberFormat().format(item.order_price) + ' 원</td>' +
        '<td class="orderVolume">' + item.order_volume + '주</td>' +
        '<td class="orderAmount">' + Intl.NumberFormat().format(item.amount) + ' 원</td>' + 
        '<td class="orderType">' + o_type + '</td>' + 
        '<td class="orderResult">' + o_result + '</td>';
        MyOrder.appendChild(newLine);
    });
}

// 모달 열기 함수
function openModalDeposit() {
    var openDepositElement = document.getElementById("openDeposit");
    if (openDepositElement) {
        openDepositElement.addEventListener("click", function () {
            document.getElementById("depositModal").style.display = "block";
        });
    }
}

// 모달 닫기 함수
function closeModalDeposit() {
    document.getElementById("depositClose").addEventListener("click", function () {
        document.getElementById("depositModal").style.display = "none";
    });
}

// 모달 열기 함수
function openModalDepositList() {
    var openListElement = document.getElementById("openDepositList");
    if (openListElement) {
        openListElement.addEventListener("click", function () {
            document.getElementById("depositListModal").style.display = "block";
        });
    }
}

// 모달 닫기 함수
function closeModalDepositList() {
    document.getElementById("depositListClose").addEventListener("click", function () {
        document.getElementById("depositListModal").style.display = "none";
    });
}

// 모달 열기 함수
function openModalOrder() {
    var openOrderElement = document.getElementById("openOrder");
    if (openOrderElement) {
        openOrderElement.addEventListener("click", function () {
            document.getElementById("orderListModal").style.display = "block";
        });
    }
}

// 모달 닫기 함수
function closeModalOrder() {
    document.getElementById("orderListClose").addEventListener("click", function () {
        document.getElementById("orderListModal").style.display = "none";
    });
}

function changeDepositAction() {
    const Action = {
        "deposit" : "입금",
        "withdrawal" : "출금"
    }
    const selectedId = $(this).attr("id");

    if ($(this).hasClass("on") != true) {
        $(this).parents('.tab').find('.select').removeClass('on');
    }

    $(this).addClass("on");
    document.getElementById("actionLabel").textContent = Action[selectedId] + "할 금액";
}

function calcPortfolioScore(data){
    const benchmark = Math.abs(data.benchmark_AVG) / data.benchmark_AVG;
    const stability = Math.round(benchmark * data.treynor) + 50;
    const efficiency = (data.sharp - 1) * 100 + 50;
    const sensitivity = 100 - (benchmark * data.beta) * 100;
    var solutionTable = document.getElementById("Mysolution");
    var td;
    var value;
    Array.from(solutionTable.children).forEach(row => {
        td = row.querySelector("td")
        if (td.id === "stability"){
            value = stability;
        } else if (td.id === "efficiency"){
            value = efficiency;
        } else {
            value =sensitivity;
        }
        td.textContent = value + "점";
    });
    return Math.round((stability + efficiency + sensitivity)/ 3).toFixed(2);
}

function requestOnecle(data){
    // let workDt = getCurrentDate();
    const workDt = "2023/10/06";
    let orders = []
    data.order.forEach(element => {
        const request = {
            isin : element.isin,
            orderPrice: element.price,
            orderVolume: element.volume,
            orderTotal: element.amount,
            orderType : element.type,
            workDt : workDt,
        };
        orders.push(request);
    });
    requestOnecleData = {
        buy_amount : data.buy_amount,
        profit : data.profit,
        value_amount : data.value_amount,
        order : orders,
        workDt : workDt,
    };
    $.ajax({
        type: "POST",
        url: "/requestOnecle",
        data: JSON.stringify(requestOnecleData),
        contentType: 'application/json',
        error: function (xhr, status, error) {
            alert(error + "error");
        },
        success: function (response) {
            if (response === "success") {
                alert(`주문 요청 성공`);
            } else {
                alert("주문 요청 실패");
            }
        }
    });
}