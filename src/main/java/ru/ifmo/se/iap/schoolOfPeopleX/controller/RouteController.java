package ru.ifmo.se.iap.schoolOfPeopleX.controller;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;

@Controller
public class RouteController {
    @RequestMapping(value = {
            "/auth",
            "/auth/",
            "/auth/registration",
            "/auth/registration/",
            "/auth/recovery-password",
            "/auth/recovery-password/",
            "/schedule",
            "/schedule/",
            "/schedule/notifications",
            "/schedule/notifications/",
            "/schedule/today",
            "/schedule/today/",
            "/schedule/tomorrow",
            "/schedule/tomorrow/",
            "/schedule/week",
            "/schedule/week/",
            "/personal-area",
            "/personal-area/",
            "/courses",
            "/courses/",
    })
    @ResponseStatus(code = HttpStatus.OK)
    public String spaPage() {
        return "forward:/index.html";
    }
}
