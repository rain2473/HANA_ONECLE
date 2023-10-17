package com.hanaonecle.portfolio.model.dto;

import lombok.Data;

import java.sql.Date;

@Data
public class Rebalanced {
    private String name;
    private float diff;
    private long new_value;
    private float new_portion;
}
