package com.hanaonecle.user.model.dao;
import com.hanaonecle.user.model.dto.User;
import com.hanaonecle.user.model.dto.UserInfo;
import org.apache.ibatis.annotations.Mapper;
import java.util.*;

@Mapper
public interface UserMapper {
    void insertUser(User user);
    boolean updateUser(User user);
    int deleteUser(String id);
    User loginUser(HashMap<String, String> loginData);
    User selectOneUser(String id);
    UserInfo getUserInfo(String id);
    String getUserName(String id);
}
