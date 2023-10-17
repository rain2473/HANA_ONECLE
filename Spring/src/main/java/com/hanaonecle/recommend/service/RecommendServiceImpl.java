package com.hanaonecle.recommend.service;

import com.hanaonecle.recommend.model.dao.RecommendMapper;
import com.hanaonecle.recommend.model.dto.RecommendOption;
import com.hanaonecle.recommend.model.dto.RecommendResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RecommendServiceImpl implements RecommendService {
    private RecommendMapper recommendMapper;

    @Autowired
    public RecommendServiceImpl(RecommendMapper recommendMapper) {
        this.recommendMapper = recommendMapper;
    }

    public List<RecommendResult> recommendByOption(RecommendOption recommendOption){
        List<RecommendResult> resultSet;
        System.out.println(recommendOption.getSortByModels());
        if (recommendOption.getSortByModels().equals("TOTAL_SCORE")){
            resultSet = recommendMapper.recommendByOptionTotal(recommendOption);
        }
        else if (recommendOption.getSortByModels().equals("AI_SCORE")){
            resultSet = recommendMapper.recommendByOptionAi(recommendOption);
        } else {
            resultSet = recommendMapper.recommendByOptionStatistics(recommendOption);
        }
        resultSet.get(0).setRank("first");
        resultSet.get(1).setRank("second");
        resultSet.get(2).setRank("third");
        resultSet.get(3).setRank("fourth");
        resultSet.get(4).setRank("fifth");
        return resultSet;
    }

    public List<RecommendResult> recommendTotal(){
        List<RecommendResult> resultSet = recommendMapper.recommendTotal();
        resultSet.get(0).setRank("first");
        resultSet.get(1).setRank("second");
        resultSet.get(2).setRank("third");
        resultSet.get(3).setRank("fourth");
        resultSet.get(4).setRank("fifth");
        return resultSet;
    }
    public List<RecommendResult> recommendKospi(){
        List<RecommendResult> resultSet = recommendMapper.recommendKospi();
        resultSet.get(0).setRank("first");
        resultSet.get(1).setRank("second");
        resultSet.get(2).setRank("third");
        resultSet.get(3).setRank("fourth");
        resultSet.get(4).setRank("fifth");
        return resultSet;
    }
    public List<RecommendResult> recommendKosdaq(){
        List<RecommendResult> resultSet = recommendMapper.recommendKosdaq();
        resultSet.get(0).setRank("first");
        resultSet.get(1).setRank("second");
        resultSet.get(2).setRank("third");
        resultSet.get(3).setRank("fourth");
        resultSet.get(4).setRank("fifth");
        return resultSet;
    }
    public List<RecommendResult> recommendVolume10(){
        List<RecommendResult> resultSet = recommendMapper.recommendVolume10();
        resultSet.get(0).setRank("first");
        resultSet.get(1).setRank("second");
        resultSet.get(2).setRank("third");
        resultSet.get(3).setRank("fourth");
        resultSet.get(4).setRank("fifth");
        return resultSet;
    }
    public List<RecommendResult> recommendUpdown10(){
        List<RecommendResult> resultSet = recommendMapper.recommendUpdown10();
        resultSet.get(0).setRank("first");
        resultSet.get(1).setRank("second");
        resultSet.get(2).setRank("third");
        resultSet.get(3).setRank("fourth");
        resultSet.get(4).setRank("fifth");
        return resultSet;
    }
    public List<RecommendResult> recommendService(){
        List<RecommendResult> resultSet = recommendMapper.recommendService();
        resultSet.get(0).setRank("first");
        resultSet.get(1).setRank("second");
        resultSet.get(2).setRank("third");
        resultSet.get(3).setRank("fourth");
        resultSet.get(4).setRank("fifth");
        return resultSet;
    }
    public List<RecommendResult> recommendManufacturing(){
        List<RecommendResult> resultSet = recommendMapper.recommendManufacturing();
        resultSet.get(0).setRank("first");
        resultSet.get(1).setRank("second");
        resultSet.get(2).setRank("third");
        resultSet.get(3).setRank("fourth");
        resultSet.get(4).setRank("fifth");
        return resultSet;
    }
}
