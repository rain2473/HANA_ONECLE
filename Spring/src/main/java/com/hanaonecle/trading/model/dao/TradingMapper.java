package com.hanaonecle.trading.model.dao;

import com.hanaonecle.trading.model.dto.*;
import org.apache.ibatis.annotations.Mapper;

import java.util.*;

@Mapper
public interface TradingMapper {
    List<PriceInfo> findStockByIsin(String isin);
    String findStockNameByIsin(String isin);
    ScoreInfo getScoreByIsin(String isin);
    int stocksInBalance(ExistRequest existRequest);
    RecievedInfo getReceiveForTransaction(String one_id);
    List<Stock> stockSearching(String input);
    void insertNewOrderHistory(OrderRequest orderRequest);
    void insertNewConclusionHistory(OrderRequest orderRequest);
    void updateBalanceSell(OrderRequest orderRequest);
    void updateAccountSell(OrderRequest orderRequest);
    void updateBalanceBuy(OrderRequest orderRequest);
    void updateAccountBuy(OrderRequest orderRequest);
    void updatePortfolio(PortfolioInput portfolioInput);
}