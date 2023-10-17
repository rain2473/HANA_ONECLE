package com.hanaonecle.recommend.model.dto;

import lombok.Data;
import java.util.*;

@Data
public class RecommendOption {
    String sortByModels;
    List<Integer> selectedSectors;
    Float VOLUME;
    Float UPDOWN;
    Float EPS;
    Float PBR;
    Float PER;
    public RecommendOption(String sortByModels, List<Integer> selectedSectors, Map<String, String> selectedFilters){
        this.sortByModels = sortByModels;
        this.selectedSectors = selectedSectors;
        this.VOLUME = Float.parseFloat(String.format("%.1f", Float.parseFloat(selectedFilters.get("VOLUME") ) / 100));
        this.UPDOWN = Float.parseFloat(String.format("%.1f", Float.parseFloat(selectedFilters.get("UPDOWN") ) / 100));
        this.EPS = Float.parseFloat(String.format("%.1f", Float.parseFloat(selectedFilters.get("EPS") ) / 100));
        this.PBR = Float.parseFloat(String.format("%.1f", Float.parseFloat(selectedFilters.get("PBR") ) / 100));
        this.PER = Float.parseFloat(String.format("%.1f", Float.parseFloat(selectedFilters.get("PER") ) / 100));
    }
}