package com.hanaonecle.trading.model.dto;

import lombok.Data;
import java.sql.Date;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

@Data
public class OrderRequest {
    private String oneId;
    private String isin;
    private Date workDt;
    private int orderPrice;
    private int orderVolume;
    private long orderTotal;
    private int orderType;
    public OrderRequest(String one_id, HashMap<String, String> orderData){
        this.oneId = one_id;
        this.isin = orderData.get("isin");
        this.orderPrice = Integer.parseInt(orderData.get("orderPrice"));
        this.orderVolume = Integer.parseInt(orderData.get("orderVolume"));
        this.orderTotal = Long.parseLong(orderData.get("orderTotal"));
        this.orderType = Integer.parseInt(orderData.get("orderType"));
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy/MM/dd");
        try {
            java.util.Date utilDate = dateFormat.parse(orderData.get("workDt"));
            this.workDt = new java.sql.Date(utilDate.getTime());
        } catch (ParseException e) {
            e.printStackTrace();
        }
    }
}