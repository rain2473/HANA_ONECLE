package com.hanaonecle.user.model.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class User {
    private String one_id;
    private String name;
    private String password;
    private String phone;
    private String email;
    private String state;
    public User() {
    }
}
