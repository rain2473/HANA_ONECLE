package com.hanaonecle.trading.controller;

import com.hanaonecle.trading.model.dto.*;
import com.hanaonecle.trading.service.TradingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.*;

@Controller
public class TradingController {
    private final TradingService tradingService;

    @Autowired
    public TradingController(TradingService tradingService) {
        this.tradingService = tradingService;
    }

    @RequestMapping("/trading")
    public ModelAndView trading(@RequestParam(name = "isin") String isin) {
        ModelAndView mav = new ModelAndView();
        mav.addObject("isin", isin);
        mav.setViewName("trading");
        return mav;
    }

    @GetMapping(value = "/tradingData", produces = "application/json")
    @ResponseBody
    public ChartInfo tradingData(HttpSession session, @RequestParam(name = "isin") String isin) {
        return tradingService.findStockByIsin(isin);
    }

    @GetMapping(value = "/scoreData", produces = "application/json")
    @ResponseBody
    public ScoreInfo scoreData(HttpSession session, @RequestParam(name = "isin") String isin) {
        return tradingService.getScoreByIsin(isin);
    }

    @GetMapping(value = "/stockExistInBalance", produces = "application/json")
    @ResponseBody
    public Boolean stockExistInBalance(HttpSession session, @RequestParam(name = "isin") String isin) {
        return tradingService.stockExistInBalance(session, isin);
    }

    @GetMapping(value = "/stocksInBalance", produces = "application/json")
    @ResponseBody
    public int stocksInBalance(HttpSession session, @RequestParam(name = "isin") String isin) {
        return tradingService.stocksInBalance(session, isin);
    }

    @GetMapping(value = "/getReceiveForTransaction", produces = "application/json")
    @ResponseBody
    public RecievedInfo getReceiveForTransaction(HttpSession session) {
        return tradingService.getReceiveForTransaction(session);
    }

    @PostMapping("/requestOrder")
    public ResponseEntity<String> requestOrder(@RequestBody HashMap<String, String> orderData, HttpServletRequest request) {
        Boolean result = tradingService.requestOrder(orderData, request);
        if (result) {
            return ResponseEntity.ok("success");
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("fail");
        }
    }

    @ResponseBody
    @GetMapping(value = "/stocksData")
    public ResponseEntity<List<Stock>> stockSearching(@RequestParam("input") String input) {
        List<Stock> stockList = tradingService.stockSearching(input);
        if (stockList != null && !stockList.isEmpty()) {
            return ResponseEntity.ok(stockList);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
