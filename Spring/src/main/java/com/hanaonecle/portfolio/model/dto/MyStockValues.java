package com.hanaonecle.portfolio.model.dto;

import lombok.Data;

@Data
public class MyStockValues {
    private String name;
    private String isin;
    private long price;
    private int realtime;
    private long volume;
}
