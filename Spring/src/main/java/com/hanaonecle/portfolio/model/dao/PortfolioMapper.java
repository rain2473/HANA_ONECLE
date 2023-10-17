package com.hanaonecle.portfolio.model.dao;
import com.hanaonecle.portfolio.model.dto.*;
import org.apache.ibatis.annotations.Mapper;

import java.util.*;

@Mapper
public interface PortfolioMapper {
    DepositInfo getDepositData(String id);
    MyAccount getMyAccountData(String id);
    Eveluation getPortfolioScore(String id);
    long getCashData(String id);
    List<OrderStocks> getSellData(String id);
    List<OrderStocks> getBuyData(String id);
    List<Rebalanced> getRebalancedData(String id);
    List<DepositHistory> getDepositHistory(String id);
    List<OrderHistory> getOrderHistory(String id);
    List<Benefit> getBenefitData(String id);
    List<Benefit> getBenchmarkData(String id);
    String getGoalData(String id);
    List<MyStocks> getMyStocks(String id);
    List<MyStockValues> getMyStocksAndValue(String id);
    void insertNewDepositHistory(DepositInput depositInput);
    void updateDepositIncome(DepositInput depositInput);
    void updateDepositOutcome(DepositInput depositInput);
    void insertNewOrderHistoryP(OrderRequestP orderRequest);
    void insertNewConclusionHistoryP(OrderRequestP orderRequest);
    void updateBalanceSellP(OrderRequestP orderRequest);
    void updateAccountSellP(OrderRequestP orderRequest);
    void updateBalanceBuyP(OrderRequestP orderRequest);
    void updateAccountBuyP(OrderRequestP orderRequest);
    void updatePortfolioP(PortfolioInputP portfolioInput);

}
