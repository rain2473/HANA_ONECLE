package com.hanaonecle.trading.service;

import com.hanaonecle.trading.model.dto.ChartInfo;
import com.hanaonecle.trading.model.dto.RecievedInfo;
import com.hanaonecle.trading.model.dto.ScoreInfo;
import com.hanaonecle.trading.model.dto.Stock;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.*;
public interface TradingService {

    public ChartInfo findStockByIsin(String isin);
    public ScoreInfo getScoreByIsin(String isin);
    public int stocksInBalance(HttpSession session, String isin);
    public Boolean stockExistInBalance(HttpSession session, String isin);
    public RecievedInfo getReceiveForTransaction(HttpSession session);
    public Boolean requestOrder(HashMap<String, String> orderData, HttpServletRequest request);
    public List<Stock> stockSearching(String input);
}
