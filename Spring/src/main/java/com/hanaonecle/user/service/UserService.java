package com.hanaonecle.user.service;

import com.hanaonecle.user.model.dto.User;
import com.hanaonecle.user.model.dto.UserInfo;

import java.util.*;

public interface UserService {
    boolean updateUser(User user);
    int deleteUser(String id);
    void insertUser(User user);

    User loginUser(HashMap<String, String> loginData);
    User selectOneUser(String id);
    UserInfo getUserInfo(String id);
    String getUserName(String id);
}

