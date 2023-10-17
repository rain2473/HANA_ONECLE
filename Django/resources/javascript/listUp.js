// 메인분류 클릭
function selectMain(){
    if($(this).hasClass("on") == true){
        return false;
    }

    $("#mainSelect .select").removeClass("on");
    $(this).addClass("on");
    
    let main = $(this).data('main');

    if(main != "all"){
        $("table.table-stock tbody tr").hide();
        $("table.table-stock tbody tr."+main).show();
    }else{
        $("table.table-stock tbody tr").show();
    }
}

// 일일 / 기간 선택
function selectTime(){
    if($(this).hasClass("on") == true){
        return false;
    }

    $("#timeSelect .select").removeClass("on");
    $(this).addClass("on");

    let time = $(this).data('time');

    $("table.table-stock").hide();
    $("table.table-stock.table-"+time).show();
}

// 정렬
function sortList(){
    var currentUrl = window.location.href;
    var urlParts = currentUrl.split("/");
    var page = urlParts[urlParts.length - 2];
    console.log("마지막 링크: " + page);

    let table = $("table.table-stock.table-"+$("#timeSelect .select").data("time"));
    if (page === "national"){
        table = $("table.table-stock");
    }

    let idx = $(this).index();
    let items = table.find("tbody tr").get();
    let is_Num = $(this).hasClass("txt_num");
    let item1, item2;

    // 오름차순 -> 내림차순 변경
    if($(this).hasClass("ascend") == true){
        $(this).removeClass('ascend').addClass('descend');

        items.sort(function(a, b){
            if(is_Num == true){
                item1 = $(a).children('td').eq(idx).data('value') * 1;
                item2 = $(b).children('td').eq(idx).data('value') * 1;
            }else{
                item1 = $.trim($(a).children('td').eq(idx).text());
                item2 = $.trim($(b).children('td').eq(idx).text());
            }

            return (item1 > item2) ? -1 : 1;
        });
    }
    // 내림차순 -> 오름차순 변경
    else if($(this).hasClass("descend") == true){
        $(this).removeClass('descend').addClass('ascend');

        items.sort(function(a, b){
            if(is_Num == true){
                item1 = $(a).children('td').eq(idx).data('value') * 1;
                item2 = $(b).children('td').eq(idx).data('value') * 1;
            }else{
                item1 = $.trim($(a).children('td').eq(idx).text());
                item2 = $.trim($(b).children('td').eq(idx).text());
            }
            
            return (item1 > item2) ? 1 : -1;
        });
    }
    // 신규 오름차순 정렬 
    else{
        table.find('thead tr th.sort').removeClass('ascend').removeClass('descend');
        $(this).addClass("ascend");

        items.sort(function(a, b){
            if(is_Num == true){
                item1 = $(a).children('td').eq(idx).data('value') * 1;
                item2 = $(b).children('td').eq(idx).data('value') * 1;
            }else{
                item1 = $.trim($(a).children('td').eq(idx).text());
                item2 = $.trim($(b).children('td').eq(idx).text());
            }

            return (item1 > item2) ? 1 : -1;
        });
    }

    $.each(items, function(idx, row){
        table.find('tbody').append(row);
    });
}

function selectListOptions(){
    $("#mainSelect .select").on("click", selectMain);
    $("#timeSelect .select").on("click", selectTime);
    $("table.table-stock thead tr th.sort").on("click", sortList);
    $("tbody tr").each(function() {
        if (!$(this).hasClass("up") && !$(this).hasClass("down") && !$(this).hasClass("hold")) {
            var span = $(this).find("td span.up, td span.down, td span.hold");
            if (span.length > 0) {
                var newClass = span.attr("class").split(' ').filter(cls => ['up', 'down', 'hold'].includes(cls)).join(' ');
                $(this).addClass(newClass);
            }
        }
    });
};
