package ru.ifmo.se.iap.schoolOfPeopleX.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.ifmo.se.iap.schoolOfPeopleX.model.Account;
import ru.ifmo.se.iap.schoolOfPeopleX.service.TeacherService;

import java.util.Optional;

@RestController
@RequestMapping("/api/teachers")
public class TeacherController {

    private final TeacherService teacherService;

    public TeacherController(final TeacherService teacherService) {
        this.teacherService = teacherService;
    }

    @GetMapping("/{teacherId}")
    public ResponseEntity getOne(@PathVariable Long teacherId) {
        Optional<Account> account = this.teacherService.getOne(teacherId);

        return account
                .map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));

    }

    @GetMapping()
    public ResponseEntity getAllTeachersByFilters(
            @RequestParam(required = false) String firstName,
            @RequestParam(required = false) String lastName,
            @RequestParam(required = false) String ability,
            @RequestParam(required = false) Boolean onlyMy
    ) {
        return new ResponseEntity<>(this.teacherService.getAllProfilesByFilters(firstName, lastName, ability, onlyMy), HttpStatus.OK);
    }

}
