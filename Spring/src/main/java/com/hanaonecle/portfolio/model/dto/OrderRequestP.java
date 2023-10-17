package com.hanaonecle.portfolio.model.dto;

import lombok.Data;

import java.sql.Date;
import java.util.HashMap;

@Data
public class OrderRequestP {
    private String oneId;
    private String isin;
    private Date workDt;
    private int orderPrice;
    private int orderVolume;
    private int orderTotal;
    private int orderType;
    public OrderRequestP(String one_id, HashMap<String, Object> orderData){
        this.oneId = one_id;
        this.isin = (String)orderData.get("isin");
        this.orderPrice = (int)orderData.get("orderPrice");
        this.orderVolume = (int)orderData.get("orderVolume");
        this.orderTotal = (int) orderData.get("orderTotal");
        this.orderType = (int)orderData.get("orderType");
        String tmpWorkDt = (String)orderData.get("workDt");
        this.workDt = Date.valueOf(tmpWorkDt.replace("/","-"));
    }
}