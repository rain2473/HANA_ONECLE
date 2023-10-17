package com.hanaonecle.recommend.model.dao;

import com.hanaonecle.recommend.model.dto.RecommendResult;
import com.hanaonecle.recommend.model.dto.RecommendOption;
import org.apache.ibatis.annotations.Mapper;
import java.util.*;

@Mapper
public interface RecommendMapper {
    List<RecommendResult> recommendByOptionTotal(RecommendOption recommendOption);
    List<RecommendResult> recommendByOptionAi(RecommendOption recommendOption);
    List<RecommendResult> recommendByOptionStatistics(RecommendOption recommendOption);
    List<RecommendResult> recommendTotal();
    List<RecommendResult> recommendKospi();
    List<RecommendResult> recommendKosdaq();
    List<RecommendResult> recommendVolume10();
    List<RecommendResult> recommendUpdown10();
    List<RecommendResult> recommendService();
    List<RecommendResult> recommendManufacturing();
}