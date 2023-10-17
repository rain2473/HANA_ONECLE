package com.hanaonecle.portfolio.service;

import com.hanaonecle.portfolio.model.dao.PortfolioMapper;
import com.hanaonecle.portfolio.model.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.interceptor.TransactionAspectSupport;
import org.springframework.web.client.RestTemplate;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.*;

@Service
public class PortfolioServiceImpl implements PortfolioService {
    private PortfolioMapper portfolioMapper;

    @Autowired
    public PortfolioServiceImpl(PortfolioMapper portfolioMapper) {
        this.portfolioMapper = portfolioMapper;
    }

    @Override
    public Map<String, Object> getPortfolioModalData(HttpSession session){
        Map<String, Object> result = new HashMap<>();
        List<OrderHistory> orderHistory = getOrderHistory(session);
        List<DepositHistory> depositHistory = getDepositHistory(session);
        DepositInfo depositData = getDepositData(session);
        result.put("order", orderHistory);
        result.put("deposit", depositHistory);
        result.put("depositData", depositData);
        return result;
    }

    @Override
    public Map<String, Object> getBenefitData(HttpSession session){
        String id = (String) session.getAttribute("id");
        Map<String, Object> result = new HashMap<>();
        result.put("benefit", portfolioMapper.getBenefitData(id));
        result.put("benchmark", portfolioMapper.getBenchmarkData(id));
        result.put("goal", portfolioMapper.getGoalData(id));
        result.put("portfolioScore", portfolioMapper.getPortfolioScore(id));
        return result;
    }

    @Override
    public Map<String, Object> getRebalancedData(HttpSession session){
        String id = (String) session.getAttribute("id");
        RestTemplate restTemplate = new RestTemplate();
        List<OrderStocks> sell = portfolioMapper.getSellData(id);
        List<OrderStocks> buy = portfolioMapper.getBuyData(id);
        for (OrderStocks stock: sell) {
            String url = "https://polling.finance.naver.com/api/realtime?query=SERVICE_ITEM:" + stock.getIsin();
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            if (response.getStatusCode() == HttpStatus.OK) {
                String responseBody = response.getBody();
                try {
                    int nvValue = Integer.parseInt(responseBody.split("\"nv\":")[1].split(",")[0].trim());
                    stock.setPrice(nvValue);
                    stock.setAmount(stock.getVolume() * nvValue);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            } else {
                System.err.println("Failed to fetch data for ISIN: " + stock.getIsin());
            }
        }
        for (OrderStocks stock: buy) {
            String url = "https://polling.finance.naver.com/api/realtime?query=SERVICE_ITEM:" + stock.getIsin();
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            if (response.getStatusCode() == HttpStatus.OK) {
                String responseBody = response.getBody();
                try {
                    int nvValue = Integer.parseInt(responseBody.split("\"nv\":")[1].split(",")[0].trim());
                    stock.setPrice(nvValue);
                    stock.setAmount(stock.getVolume() * nvValue);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            } else {
                System.err.println("Failed to fetch data for ISIN: " + stock.getIsin());
            }
        }
        Map<String, Object> result = new HashMap<>();
        result.put("goal", portfolioMapper.getGoalData(id));
        result.put("rebalanced", portfolioMapper.getRebalancedData(id));
        result.put("sell", sell);
        result.put("buy", buy);
        result.put("cash", portfolioMapper.getCashData(id));
        return result;
    }

    @Override
    public MyAccount getMyAccountData(HttpSession session) {
        String id = (String) session.getAttribute("id");
        return portfolioMapper.getMyAccountData(id);
    }

    @Override
    public List<MyStockValues> getMyStocksAndValue(HttpSession session){
        String id = (String) session.getAttribute("id");
        String url = "https://polling.finance.naver.com/api/realtime?query=SERVICE_ITEM:";
        RestTemplate restTemplate = new RestTemplate();
        List<MyStockValues> result = new ArrayList<>();
        for (MyStockValues stock: portfolioMapper.getMyStocksAndValue(id)) {
            if (stock.getIsin().equals("000000")){
                continue;
            }
            ResponseEntity<String> response = restTemplate.getForEntity(url + stock.getIsin(), String.class);
            if (response.getStatusCode() == HttpStatus.OK) {
                String responseBody = response.getBody();
                try {
                    int nvValue = Integer.parseInt(responseBody.split("\"nv\":")[1].split(",")[0].trim());
                    stock.setRealtime(nvValue);
                    stock.setPrice(stock.getVolume() * nvValue);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            } else {
                System.err.println("Failed to fetch data for ISIN: " + stock.getIsin());
            }
        }
        return portfolioMapper.getMyStocksAndValue(id);
    }

    @Override
    public List<MyStocks> getMyStocks(HttpSession session){
        String id = (String) session.getAttribute("id");
        return portfolioMapper.getMyStocks(id);
    }

    @Override
    public Map<String, Object> MyAssetData(HttpSession session)  {
        Map<String, Object> result = new HashMap<>();
        result.put("stocks", getMyStocksAndValue(session));
        result.put("account", getMyAccountData(session));
        return result;
    }

    @Override
    public DepositInfo getDepositData(HttpSession session){
        String id = (String) session.getAttribute("id");
        return portfolioMapper.getDepositData(id);
    }

    @Override
    public List<DepositHistory> getDepositHistory(HttpSession session){
        String id = (String) session.getAttribute("id");
        return portfolioMapper.getDepositHistory(id);
    }

    @Override
    public List<OrderHistory> getOrderHistory(HttpSession session){
        String id = (String) session.getAttribute("id");
        return portfolioMapper.getOrderHistory(id);
    }

    @Override
    @Transactional
    public Boolean depositTransaction(HashMap<String, String> depositTransactionData, HttpServletRequest request){
        DepositInput depositInput = new DepositInput(depositTransactionData, request);
        Boolean result = true;
        try {
            portfolioMapper.insertNewDepositHistory(depositInput);
            if (depositInput.getInout() == 1){
                portfolioMapper.updateDepositOutcome(depositInput);
            } else {
                portfolioMapper.updateDepositIncome(depositInput);
            }
        }
        catch (Exception e){
            TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
            e.printStackTrace();
            result = false;
        }
        return result;
    }

    @Override
    public Boolean requestOnecle(HashMap<String, Object> onecleData, HttpServletRequest request){
        String one_id = (String) request.getSession().getAttribute("id");
        PortfolioInputP portfolioInput = new PortfolioInputP(onecleData, one_id);
        List<HashMap<String, Object>> orderList = (List<HashMap<String, Object>>) onecleData.get("order");
        List<OrderRequestP> order = new ArrayList<>();
        OrderRequestP orderRequest;
        Boolean result = true;
        try {
            for (HashMap<String, Object> orderData : orderList){
                orderRequest = new OrderRequestP(one_id, orderData);
                portfolioMapper.insertNewOrderHistoryP(orderRequest);
                portfolioMapper.insertNewConclusionHistoryP(orderRequest);
                if (orderRequest.getOrderType() == 1){
                    portfolioMapper.updateBalanceSellP(orderRequest);
                    portfolioMapper.updateAccountSellP(orderRequest);
                } else {
                    portfolioMapper.updateBalanceBuyP(orderRequest);
                    portfolioMapper.updateAccountBuyP(orderRequest);
                }
            }
            portfolioMapper.updatePortfolioP(portfolioInput);
        }
        catch (Exception e){
            e.printStackTrace();
            result = false;
        }
        return result;
    }
}


