package com.hanaonecle.portfolio.model.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class DepositInfo {
    private String one_id;
    private String acc_id;
    private String DEPOSIT_RECEIVED;
    private String WITHDRAWAL_AVAILABLE;
    private String WITHDRAW_AMOUNT;
    public DepositInfo() {
    }
}
