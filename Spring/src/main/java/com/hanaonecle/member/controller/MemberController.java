package com.hanaonecle.member.controller;

import com.hanaonecle.member.service.MemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;
import java.util.*;

@Controller
public class MemberController {
    private final MemberService userService;

    @Autowired
    public MemberController(MemberService userService) {
        this.userService = userService;
    }
    @ResponseBody
    @RequestMapping(value = "/idCheck")
    public ResponseEntity<
            Map<String, Boolean>> idCheck(@RequestParam("id") String id) {
        // id 중복 체크
        boolean isExists = userService.selectOneMember(id) > 0;
        Map<String, Boolean> response = new HashMap<>();
        response.put("exists", isExists);
        return ResponseEntity.ok(response);
    }

    @RequestMapping("/signUp")
    public ModelAndView signUp() {
        ModelAndView mav = new ModelAndView();
        mav.setViewName("signUp");
        return mav;
    }

    @RequestMapping("/investType")
    public ModelAndView investType() {
        ModelAndView mav = new ModelAndView();
        mav.setViewName("investType");
        return mav;
    }

    @RequestMapping("/investInfo")
    public ModelAndView investInfo() {
        ModelAndView mav = new ModelAndView();
        mav.setViewName("investInfo");
        return mav;
    }

    @RequestMapping("/signUpFinished")
    public ModelAndView signUpFinished() {
        ModelAndView mav = new ModelAndView();
        mav.setViewName("signUpFinished");
        return mav;
    }

    @RequestMapping("/updateInvestInfo")
    public ModelAndView updateInvestInfo() {
        ModelAndView mav = new ModelAndView();
        mav.setViewName("updateInvestInfo");
        return mav;
    }

    @RequestMapping("/updateInvestType")
    public ModelAndView updateInvestType() {
        ModelAndView mav = new ModelAndView();
        mav.setViewName("updateInvestType");
        return mav;
    }

    @RequestMapping("/updatePassWord")
    public ModelAndView updatePassWord() {
        ModelAndView mav = new ModelAndView();
        mav.setViewName("updatePassWord");
        return mav;
    }

    @RequestMapping("/updateMemberInfo")
    public ModelAndView updateMemberInfo() {
        ModelAndView mav = new ModelAndView();
        mav.setViewName("updateMemberInfo");
        return mav;
    }

    @RequestMapping("/resignCheck")
    public ModelAndView resignCheck() {
        ModelAndView mav = new ModelAndView();
        mav.setViewName("resignCheck");
        return mav;
    }

    @RequestMapping("/resignFinished")
    public ModelAndView resignFinished() {
        ModelAndView mav = new ModelAndView();
        mav.setViewName("resignFinished");
        return mav;
    }
}
