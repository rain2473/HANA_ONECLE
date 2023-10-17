package com.hanaonecle.user.service;
import com.hanaonecle.user.model.dto.User;
import com.hanaonecle.user.model.dao.UserMapper;

import com.hanaonecle.user.model.dto.UserInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class UserServiceImpl implements com.hanaonecle.user.service.UserService {
    private UserMapper UserMapper;

    @Autowired
    public UserServiceImpl(UserMapper UserMapper) {
        this.UserMapper = UserMapper;
    }

    @Override
    public User loginUser(HashMap<String, String> loginData) {
        return UserMapper.loginUser(loginData);
    }

    @Override
    public int deleteUser(String id) {
        return UserMapper.deleteUser(id);
    }
    @Override
    public void insertUser(User user) {
        UserMapper.insertUser(user);
    }

    @Override
    public boolean updateUser(User m) {
        try {
            UserMapper.updateUser(m);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public UserInfo getUserInfo(String id){
        return UserMapper.getUserInfo(id);
    }
    @Override
    public User selectOneUser(String id){
        return UserMapper.selectOneUser(id);
    }
    @Override
    public String getUserName(String id){
        return UserMapper.getUserName(id);
    }
}


