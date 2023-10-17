package com.hanaonecle.recommend.model.dto;

import lombok.Data;

@Data
public class RecommendResult {
    private String name;
    private String isin;
    private String rank;
}
