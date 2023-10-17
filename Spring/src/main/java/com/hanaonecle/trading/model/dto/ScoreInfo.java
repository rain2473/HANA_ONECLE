package com.hanaonecle.trading.model.dto;

import lombok.Data;

@Data
public class ScoreInfo {
    private String mentionScore;
    private String positiveScore;
    private String priceScore;
    private String updownScore;
    private String rsiScore;
    private String obvScore;
    private String stochasticScore;
    private String momentumScore;
}
