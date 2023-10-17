package com.hanaonecle.member.model.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class Member {
    private String one_id;
    private String name;
    private String password;
    private String phoneNumber;
    private String email;
    private String state;
    public Member() {
    }
}
