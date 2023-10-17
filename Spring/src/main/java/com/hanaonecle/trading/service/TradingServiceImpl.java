package com.hanaonecle.trading.service;

import com.hanaonecle.trading.model.dao.TradingMapper;
import com.hanaonecle.trading.model.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.interceptor.TransactionAspectSupport;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.List;

@Service
public class TradingServiceImpl implements TradingService {
    private TradingMapper tradingMapper;

    @Autowired
    public TradingServiceImpl(TradingMapper tradingMapper) {
        this.tradingMapper = tradingMapper;
    }

    @Override
    public ChartInfo findStockByIsin(String isin){
        List<PriceInfo> data = tradingMapper.findStockByIsin(isin);
        String stockName = tradingMapper.findStockNameByIsin(isin);
        return new ChartInfo(stockName, data);
    }

    @Override
    public ScoreInfo getScoreByIsin(String isin){
        return tradingMapper.getScoreByIsin(isin);
    }

    @Override
    public Boolean stockExistInBalance(HttpSession session, String isin){
        String one_id = (String) session.getAttribute("id");
        ExistRequest existRequest = new ExistRequest(one_id, isin);
        if (tradingMapper.stocksInBalance(existRequest) == 0){
            return false;
        } else {
            return true;
        }
    }

    @Override
    public int stocksInBalance(HttpSession session, String isin){
        String one_id = (String) session.getAttribute("id");
        ExistRequest existRequest = new ExistRequest(one_id, isin);
        return tradingMapper.stocksInBalance(existRequest);
    }
    @Override
    public RecievedInfo getReceiveForTransaction(HttpSession session){
        String one_id = (String) session.getAttribute("id");
        return tradingMapper.getReceiveForTransaction(one_id);
    }

    @Override
    public Boolean requestOrder(HashMap<String, String> orderData, HttpServletRequest request){
        String one_id = (String) request.getSession().getAttribute("id");
        OrderRequest orderRequest = new OrderRequest(one_id, orderData);
        Boolean result = true;
        try {
            tradingMapper.insertNewOrderHistory(orderRequest);
            tradingMapper.insertNewConclusionHistory(orderRequest);
            if (orderRequest.getOrderType() == 1){
                tradingMapper.updateBalanceSell(orderRequest);
                tradingMapper.updateAccountSell(orderRequest);
            } else {
                tradingMapper.updateBalanceBuy(orderRequest);
                tradingMapper.updateAccountBuy(orderRequest);
            }
//            tradingMapper.updatePortfolio(portfolioInput);
        }
        catch (Exception e){
            TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
            e.printStackTrace();
            result = false;
        }
        return result;
    }

    @Override
    public List<Stock> stockSearching(String input){
        List<Stock> result = tradingMapper.stockSearching(input + "%");
        return result;
    }
}