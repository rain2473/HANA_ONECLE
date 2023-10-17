package com.hanaonecle.portfolio.model.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import java.sql.Date;

@Data
@Getter
@Setter
public class DepositHistory {
    private Date dep_dt;
    private long amount;
    private int inout;
    private long total_deposit;
    public DepositHistory() {
    }
}
