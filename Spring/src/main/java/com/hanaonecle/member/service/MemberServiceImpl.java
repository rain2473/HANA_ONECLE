package com.hanaonecle.member.service;

import com.hanaonecle.member.model.dao.MemberMapper;
import com.hanaonecle.member.model.dto.Deposit;
import com.hanaonecle.member.model.dto.InvestInfo;
import com.hanaonecle.member.model.dto.Member;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class MemberServiceImpl implements com.hanaonecle.member.service.MemberService {
    private MemberMapper memberMapper;

    @Autowired
    public MemberServiceImpl(MemberMapper memberMapper) {
        this.memberMapper = memberMapper;
    }

    @Override
    public List<Member> getAllMember() {
        return memberMapper.getAllMember();
    }


    @Override
    public Member selectNameOfMember(String id) {
        return memberMapper.selectNameOfMember(id);
    }

    @Override
    public void insertInvestInfo(Member member) {
        memberMapper.insertInvestInfo(member);
    }

    @Override
    public InvestInfo selectInvestInfo(String id) {
        return memberMapper.selectInvestInfo(id);
    }

    @Override
    public void updateInvest(Member m) {
        memberMapper.updateInvest(m);
    }

    @Override
    public int findUserCash(String id) {
        Optional<InvestInfo> optionalInvestInfo = memberMapper.findInvestInfoById(id);
        int UserCash = 0;
        if (optionalInvestInfo.isPresent()) {
            InvestInfo investInfo = optionalInvestInfo.get();
            UserCash = investInfo.getCash();
        }
        return UserCash;
    }

    @Override
    public int findUserGoal(String id) {
        Optional<InvestInfo> optionalInvestInfo = memberMapper.findInvestInfoById(id);
        int UserCash = 0;
        if (optionalInvestInfo.isPresent()) {
            InvestInfo investInfo = optionalInvestInfo.get();
            UserCash = investInfo.getGoal();
        }
        return UserCash;
    }

    @Override
    public int updateInvestInfoCashById(String id, int cash) {
        Map<String, Object> map = new HashMap<>();
        map.put("cash", cash);
        map.put("id", id);
        try {
            memberMapper.updateInvestInfoCashById(map);
            return 1;
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }

    @Override
    public int insertDeposit(Deposit deposit) {
        try {
            memberMapper.insertDeposit(deposit);
            return 1;
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }

    @Override
    public int deposit(String id, int cash) {
        try {
            int newCash = findUserCash(id) + cash;
            Deposit deposit = new Deposit();
            deposit.setId(id);
            deposit.setAmount(cash);
            updateInvestInfoCashById(id, newCash + 100);
            insertDeposit(deposit);
            selectDeposit(id);
            return 1;
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }

    @Override
    public List<Deposit> selectDeposit(String id) {
        List<Deposit> resultList = null;
        try {
            resultList = memberMapper.selectDeposit(id);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return resultList;
    }

    @Override
    public int selectOneMember(String id) {
        try {
            return memberMapper.selectOneMember(id);
        } catch (Exception e) {
            return 0;
        }
    }

    @Override
    public Member selectNameAndEmailOfMember(HashMap<String, String> kakaoLogin) {
        try {
            return memberMapper.selectNameAndEmailOfMember(kakaoLogin);
        } catch (Exception e) {
            return null;
        }
    }

}


