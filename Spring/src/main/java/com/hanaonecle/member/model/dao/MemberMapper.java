package com.hanaonecle.member.model.dao;

import com.hanaonecle.member.model.dto.Deposit;
import com.hanaonecle.member.model.dto.InvestInfo;
import com.hanaonecle.member.model.dto.Member;
import org.apache.ibatis.annotations.Mapper;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Mapper
public interface MemberMapper {

    List<Member> getAllMember();
    void insertMember(Member member);
    int selectOneMember(String id);
    boolean updateMember(Member m);
    int deleteMember(String id);
    Member loginMember(HashMap<String, String> loginData);
    Member selectNameAndEmailOfMember(HashMap<String, String> kakaoLogin);
    Member selectNameOfMember(String id);
    void insertInvestInfo(Member member);
    Optional<InvestInfo> findInvestInfoById(String id);
    int updateInvestInfoCashById(Map<String, Object> idAndNewCash);
    InvestInfo selectInvestInfo(String id);
    void updateInvest(Member m);
    int insertDeposit(Deposit deposit);
    List<Deposit> selectDeposit(String id);
}
