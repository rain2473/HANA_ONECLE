package com.hanaonecle.portfolio.controller;

import com.hanaonecle.portfolio.model.dto.*;
import com.hanaonecle.portfolio.service.PortfolioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
public class PortfolioController {
    private final PortfolioService portfolioService;

    @Autowired
    public PortfolioController(PortfolioService portfolioService) {
        this.portfolioService = portfolioService;
    }

    @RequestMapping("/portfolio")
    public ModelAndView portfolio(HttpSession session) {
        ModelAndView mav = new ModelAndView();
        mav.setViewName("portfolio");
        return mav;
    }

    @RequestMapping("/solution")
    public ModelAndView solution(HttpSession session) {
        ModelAndView mav = new ModelAndView();
        mav.setViewName("solution");
        return mav;
    }

    @GetMapping(value = "/getBenefitData", produces = "application/json")
    @ResponseBody
    public Map<String, Object> getBenefitData(HttpSession session) {
        return portfolioService.getBenefitData(session);
    }

    @GetMapping(value = "/getRebalancedData", produces = "application/json")
    @ResponseBody
    public Map<String, Object> getRebalancedData(HttpSession session) {
        return portfolioService.getRebalancedData(session);
    }

    @GetMapping(value = "/portfolioModalData", produces = "application/json")
    @ResponseBody
    public Map<String, Object> portfolioModalData(HttpSession session) {
        return portfolioService.getPortfolioModalData(session);
    }

    @GetMapping(value = "/MyStocksData", produces = "application/json")
    @ResponseBody
    public List<MyStocks> getMyStocks(HttpSession session) {
        return portfolioService.getMyStocks(session);
    }

    @GetMapping(value = "/MyAssetData", produces = "application/json")
    @ResponseBody
    public Map<String, Object> MyAssetData(HttpSession session) {
        return portfolioService.MyAssetData(session);
    }

    @PostMapping("/depositTransaction")
    public ResponseEntity<String> depositTransaction(@RequestBody HashMap<String, String> depositTransactionData, HttpServletRequest request) {
        Boolean result = portfolioService.depositTransaction(depositTransactionData, request);
        if (result) {
            return ResponseEntity.ok("success");
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("fail");
        }
    }

    @PostMapping("/requestOnecle")
    public ResponseEntity<String> requestOnecle(@RequestBody HashMap<String, Object> onecleData, HttpServletRequest request) {
        Boolean result = portfolioService.requestOnecle(onecleData, request);
        if (result) {
            return ResponseEntity.ok("success");
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("fail");
        }
    }
}