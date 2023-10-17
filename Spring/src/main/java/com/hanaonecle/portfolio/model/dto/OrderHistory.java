package com.hanaonecle.portfolio.model.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import java.sql.Date;

@Data
@Getter
@Setter
public class OrderHistory {
    private Date work_dt;
    private String name;
    private long order_price;
    private long order_volume;
    private int order_type;
    private int order_result;
    public OrderHistory() {
    }
}
