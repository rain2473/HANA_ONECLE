package com.hanaonecle.portfolio.service;

import com.hanaonecle.portfolio.model.dto.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.*;

public interface PortfolioService {
    public DepositInfo getDepositData(HttpSession session);
    public MyAccount getMyAccountData(HttpSession session);
    public Map<String, Object> getBenefitData(HttpSession session);
    public Map<String, Object> getRebalancedData(HttpSession session);
    public Map<String, Object> MyAssetData(HttpSession session);
    public Map<String, Object> getPortfolioModalData(HttpSession session);
    public List<DepositHistory> getDepositHistory(HttpSession session);
    public List<OrderHistory> getOrderHistory(HttpSession session);
    public List<MyStocks> getMyStocks(HttpSession session);
    public List<MyStockValues> getMyStocksAndValue(HttpSession session);
    public Boolean depositTransaction(HashMap<String, String> depositTransactionData, HttpServletRequest request);
    public Boolean requestOnecle(HashMap<String, Object> onecleData, HttpServletRequest request);

}

