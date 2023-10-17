package com.hanaonecle.member.service;

import com.hanaonecle.member.model.dto.Deposit;
import com.hanaonecle.member.model.dto.InvestInfo;
import com.hanaonecle.member.model.dto.Member;

import java.util.HashMap;
import java.util.List;

public interface MemberService {

    public List<Member> getAllMember();
    int selectOneMember(String id);
    Member selectNameAndEmailOfMember(HashMap<String, String> kakaoLogin);
    Member selectNameOfMember(String id);
    void insertInvestInfo(Member member);
    InvestInfo selectInvestInfo(String id);
    void updateInvest(Member m);
    int findUserCash(String id);
    int findUserGoal(String id);
    int updateInvestInfoCashById(String id, int cash);
    int insertDeposit(Deposit deposit);
    int deposit(String id, int cash);
    List<Deposit> selectDeposit(String id);
}

