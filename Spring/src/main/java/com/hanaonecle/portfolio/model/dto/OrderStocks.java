package com.hanaonecle.portfolio.model.dto;

import lombok.Data;

@Data
public class OrderStocks {
    private String name;
    private String isin;
    private int volume;
    private long price;
    private long amount;
}
