package com.hanaonecle.trading.model.dto;

import lombok.Data;

@Data
public class ExistRequest {
    private String one_id;
    private String isin;

    public ExistRequest(String one_id, String isin){
        this.one_id = one_id;
        this.isin = isin;
    }
}
