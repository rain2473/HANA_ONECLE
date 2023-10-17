package com.hanaonecle.user.model.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class UserInfo {
    private String one_id;
    private String name;
    private String phone;
    private String email;
    private String account;
    private String join_date;
    private String period;
    private String rebalance;
    private String goal;
    private String inv_type;
    public UserInfo() {
    }
}
