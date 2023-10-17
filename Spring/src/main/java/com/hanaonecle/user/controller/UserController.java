package com.hanaonecle.user.controller;

import com.hanaonecle.user.model.dto.User;
import com.hanaonecle.user.model.dto.UserInfo;
import com.hanaonecle.user.service.UserService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.*;

@Controller
public class UserController {
    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @RequestMapping("/")
    public ModelAndView index() {
        ModelAndView mav = new ModelAndView();
        mav.setViewName("index");
        return mav;
    }

    @PostMapping("/loginMember")
    public ResponseEntity<String> loginMember(@RequestBody HashMap<String, String> loginData, HttpServletRequest request) {
        User loginUser = userService.loginUser(loginData);
        HttpSession session = request.getSession();
        if (loginUser!=null) {
            session.setAttribute("name",loginUser.getName());
            session.setAttribute("phone",loginUser.getPhone());
            session.setAttribute("email",loginUser.getEmail());
            session.setAttribute("id",loginUser.getOne_id());
            return ResponseEntity.ok("로그인 성공");
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("로그인 실패");
        }
    }

    @PostMapping("/updateMember")
    public ResponseEntity<String> updateMember(@RequestBody User user) {

        try {
            User updateM = userService.selectOneUser(user.getOne_id());
            updateM.setPassword(user.getPassword());
            updateM.setPhone(user.getPhone());

            userService.updateUser(updateM);
            return ResponseEntity.ok("회원 수정 성공");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("회원 수정 실패");
        }
    }

    @PostMapping(value = "/insertMember")
    @ResponseBody
    public String insertMember(@RequestBody User user) {
        try {
            userService.insertUser(user);
            return "회원 등록 성공";
        } catch (Exception e) {
            return "회원 등록 실패";
        }
    }

    @RequestMapping(value="/logoutMember")
    public ModelAndView deleteMember(HttpSession session) {
        String id = (String) session.getAttribute("id");
        ModelAndView mav = new ModelAndView();
        session.invalidate();
        mav.addObject("msg", "로그아웃 성공");
        mav.addObject("loc","/");
        mav.setViewName("/common/message");
        return mav;
    }

    @RequestMapping("/mypage")
    public ModelAndView mypage(HttpServletRequest session) {
        ModelAndView mav = new ModelAndView();
        mav.setViewName("mypage");
        return mav;
    }

    @GetMapping(value = "/mypageData", produces = "application/json")
    @ResponseBody
    public UserInfo mypageData(HttpSession session) {
        String id = (String) session.getAttribute("id");
        UserInfo userInfo = userService.getUserInfo(id);
        return userInfo;
    }

    @GetMapping(value = "/userName", produces = "application/json")
    @ResponseBody
    public String getUserName(HttpSession session) {
        String id = (String) session.getAttribute("id");
        return userService.getUserName(id);
    }
}