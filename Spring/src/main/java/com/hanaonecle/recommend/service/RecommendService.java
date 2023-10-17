package com.hanaonecle.recommend.service;

import com.hanaonecle.recommend.model.dto.RecommendOption;
import com.hanaonecle.recommend.model.dto.RecommendResult;

import java.util.List;

public interface RecommendService {

    public List<RecommendResult> recommendByOption(RecommendOption recommendOption);
    public List<RecommendResult> recommendTotal();
    public List<RecommendResult> recommendKospi();
    public List<RecommendResult> recommendKosdaq();
    public List<RecommendResult> recommendVolume10();
    public List<RecommendResult> recommendUpdown10();
    public List<RecommendResult> recommendService();
    public List<RecommendResult> recommendManufacturing();
}