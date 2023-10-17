package com.hanaonecle.trading.model.dto;

import lombok.Data;
import java.util.List;

@Data
public class ChartInfo {
    private String name;
    private List<PriceInfo> data;
    public ChartInfo(String stockName, List<PriceInfo> data){
        this.name = stockName;
        this.data = data;
    }
}