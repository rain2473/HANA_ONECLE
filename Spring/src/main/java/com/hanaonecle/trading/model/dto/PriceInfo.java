package com.hanaonecle.trading.model.dto;

import lombok.Data;
import java.sql.Date;

@Data
public class PriceInfo {
    private Date time;
    private String open;
    private String high;
    private String low;
    private String close;
}
