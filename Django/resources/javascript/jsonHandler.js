function preprocessingJson(jsonData){
	// 작은따옴표 큰따옴표 변경, None - > null
    jsonData = jsonData.replace(/\'/g, "\"");
    jsonData = jsonData.replace(/None/g, null);
    jsonData = jsonData.replace(/False/g, false).replace(/True/g, true);

    // JSON 데이터 파싱
    var data = JSON.parse(jsonData);

	return data;
}