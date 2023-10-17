package com.hanaonecle.recommend.controller;

import com.hanaonecle.recommend.model.dto.RecommendResult;
import com.hanaonecle.recommend.service.RecommendService;
import com.hanaonecle.recommend.model.dto.RecommendOption;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
public class RecommendController {
    private final RecommendService recommendService;

    @Autowired
    public RecommendController(RecommendService recommendService) {
        this.recommendService = recommendService;
    }

    @RequestMapping("/recommend")
    public ModelAndView recommend(HttpSession session) {
        ModelAndView mav = new ModelAndView();
        mav.setViewName("recommend");
        return mav;
    }

    @PostMapping
    @ResponseBody
    @RequestMapping("/recommendOption")
    public Map<String, List<RecommendResult>> recommendOption(@RequestBody Map<String, Object> requestData) {
        String sortByModels = (String) requestData.get("sortByModels");
        List<Integer> selectedSectors = (List<Integer>) requestData.get("selectedSectors");
        Map<String, String> selectedFilters = (Map<String, String>) requestData.get("formData");
        RecommendOption recommendOption = new RecommendOption(sortByModels, selectedSectors, selectedFilters);
        List<RecommendResult> resultSet = recommendService.recommendByOption(recommendOption);
        Map<String, List<RecommendResult>> result = new HashMap<>();
        result.put("recommend", resultSet);
        return result;
    }

    @PostMapping
    @ResponseBody
    @RequestMapping("/recommendTotal")
    public Map<String, List<RecommendResult>> recommendTotal() {
        List<RecommendResult> resultSet = recommendService.recommendTotal();
        Map<String, List<RecommendResult>> result = new HashMap<>();
        result.put("recommend", resultSet);
        return result;
    }

    @PostMapping
    @ResponseBody
    @RequestMapping("/recommendKospi")
    public Map<String, List<RecommendResult>> recommendKospi() {
        List<RecommendResult> resultSet = recommendService.recommendKospi();
        Map<String, List<RecommendResult>> result = new HashMap<>();
        result.put("recommend", resultSet);
        return result;
    }

    @PostMapping
    @ResponseBody
    @RequestMapping("/recommendKosdaq")
    public Map<String, List<RecommendResult>> recommendKosdaq() {
        List<RecommendResult> resultSet = recommendService.recommendKosdaq();
        Map<String, List<RecommendResult>> result = new HashMap<>();
        result.put("recommend", resultSet);
        return result;
    }

    @PostMapping
    @ResponseBody
    @RequestMapping("/recommendVolume10")
    public Map<String, List<RecommendResult>> recommendVolume10() {
        List<RecommendResult> resultSet = recommendService.recommendVolume10();
        Map<String, List<RecommendResult>> result = new HashMap<>();
        result.put("recommend", resultSet);
        return result;
    }

    @PostMapping
    @ResponseBody
    @RequestMapping("/recommendUpdown10")
    public Map<String, List<RecommendResult>> recommendUpdown10() {
        List<RecommendResult> resultSet = recommendService.recommendUpdown10();
        Map<String, List<RecommendResult>> result = new HashMap<>();
        result.put("recommend", resultSet);
        return result;
    }

    @PostMapping
    @ResponseBody
    @RequestMapping("/recommendService")
    public Map<String, List<RecommendResult>> recommendService() {
        List<RecommendResult> resultSet = recommendService.recommendService();
        Map<String, List<RecommendResult>> result = new HashMap<>();
        result.put("recommend", resultSet);
        return result;
    }

    @PostMapping
    @ResponseBody
    @RequestMapping("/recommendManufacturing")
    public Map<String, List<RecommendResult>> recommendManufacturing() {
        List<RecommendResult> resultSet = recommendService.recommendManufacturing();
        Map<String, List<RecommendResult>> result = new HashMap<>();
        result.put("recommend", resultSet);
        return result;
    }

    @RequestMapping("/recommendResult")
    public ModelAndView recommendResult(HttpSession session) {
        ModelAndView mav = new ModelAndView();
        mav.setViewName("recommendResult");
        return mav;
    }
}
