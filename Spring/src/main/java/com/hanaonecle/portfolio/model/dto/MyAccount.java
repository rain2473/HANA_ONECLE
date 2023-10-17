package com.hanaonecle.portfolio.model.dto;

import lombok.Data;

@Data
public class MyAccount {
    private long account;
    private long profit;
    private long valuation;
    private long buy;
    private long received;
    private long withdrawal_available;
    private long withdraw_amount;
}
