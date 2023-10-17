package com.hanaonecle.portfolio.model.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;

@Data
@Getter
@Setter
public class DepositInput {
    private String one_id;
    private long amount;
    private int inout;
    public DepositInput(HashMap<String, String> depositTransactionData, HttpServletRequest request) {
        this.amount = Long.valueOf(depositTransactionData.get("amount"));
        this.inout = Integer.valueOf(depositTransactionData.get("inout"));
        this.one_id = (String) request.getSession().getAttribute("id");
    }
}
