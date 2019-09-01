package ru.ifmo.se.iap.schoolOfPeopleX.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import ru.ifmo.se.iap.schoolOfPeopleX.model.Ability;
import ru.ifmo.se.iap.schoolOfPeopleX.model.AbstractLesson;
import ru.ifmo.se.iap.schoolOfPeopleX.model.Account;
import ru.ifmo.se.iap.schoolOfPeopleX.model.Course;
import ru.ifmo.se.iap.schoolOfPeopleX.model.dto.CourseDTO;
import ru.ifmo.se.iap.schoolOfPeopleX.service.AbilityService;
import ru.ifmo.se.iap.schoolOfPeopleX.service.AccountDetailsService;
import ru.ifmo.se.iap.schoolOfPeopleX.service.CourseService;

import java.security.Principal;
import java.time.DayOfWeek;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/courses")
public class CourseController {
    private final CourseService courseService;
    private final AbilityService abilityService;
    private final AccountDetailsService accountDetailsService;

    public CourseController(
            CourseService courseService,
            AccountDetailsService accountDetailsService,
            AbilityService abilityService
    ) {
        this.courseService = courseService;
        this.abilityService = abilityService;
        this.accountDetailsService = accountDetailsService;
    }

    @PreAuthorize("hasRole('ROLE_TEACHER')")
    @PostMapping
    public ResponseEntity createCourse(Principal principal, @RequestBody CourseDTO dto) {
        ResponseEntity response;

        try {
            Account teacher = (Account) accountDetailsService.loadUserByUsername(principal.getName());
            Ability ability = abilityService.getById(dto.getAbilityId());
            Course course = new Course();

            course.setTitle(dto.getTitle());
            course.setDescription(dto.getDescription());
            course.setLessonsForPassed(dto.getLessonsForPassed());
            course.setMaximumStudents(dto.getMaximumStudents());
            course.setAbility(ability);
            course.setTeacher(teacher);
            course.setCourseStart(dto.getCourseStart());
            course.setCourseEnd(dto.getCourseEnd());
            course.setAbstractLessons(dto
                    .getAbstractLessons()
                    .stream()
                    .map(abstractLessonDTO -> {
                        AbstractLesson abstractLesson = new AbstractLesson();
                        abstractLesson.setDayOfWeek(abstractLessonDTO.getDayOfWeek());
                        abstractLesson.setLessonStart(abstractLessonDTO.getLessonStart());
                        abstractLesson.setLessonEnd(abstractLessonDTO.getLessonEnd());

                        return abstractLesson;
                    })
                    .collect(Collectors.toSet()));

            courseService.crateCourse(course, true);

            response = new ResponseEntity<>(HttpStatus.OK);
        } catch (UsernameNotFoundException e) {
            response = new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        return response;
    }

    @GetMapping
    public ResponseEntity getAll(
            @RequestParam(required = false) Long teacherId,
            @RequestParam(required = false) Long studentId,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String teacher,
            @RequestParam(required = false) String ability,
            @RequestParam(required = false) Integer dayOfWeek
    ) {
        ResponseEntity response;

        try {
            List<Course> courses = null;
            if (teacherId != null) {
                courses = courseService.getAllByTeacher(accountDetailsService.getAccountById(teacherId).get());
            } else if (studentId != null) {
                courses = courseService.getAllByStudent(accountDetailsService.getAccountById(studentId).get());
            } else {
                courses = courseService.getAll(title, teacher, ability, dayOfWeek);

            }


            response = new ResponseEntity<>(courses, HttpStatus.OK);
        } catch (UsernameNotFoundException e) {
            response = new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        return response;
    }

    @GetMapping("/{courseId}")
    public ResponseEntity getOne(@PathVariable Long courseId) {
        ResponseEntity response;

        try {
            response = new ResponseEntity<>(courseService.getOne(courseId), HttpStatus.OK);
        } catch (UsernameNotFoundException e) {
            response = new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        return response;
    }

    @GetMapping("/lesson")
    public ResponseEntity getOneByLessonId(@RequestParam Long lessonId) {
        ResponseEntity response;

        try {
            response = new ResponseEntity<>(courseService.getOneByLessonId(lessonId), HttpStatus.OK);
        } catch (UsernameNotFoundException e) {
            response = new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        return response;
    }


    @PreAuthorize("hasRole('ROLE_STUDENT')")
    @PostMapping("/{courseId}/subscribe")
    public ResponseEntity subscribe(Principal principal, @PathVariable Long courseId) {
        ResponseEntity response;

        try {
            Account account = (Account) accountDetailsService.loadUserByUsername(principal.getName());

            courseService.subscribe(account, courseId);

            response = new ResponseEntity<>(HttpStatus.OK);
        } catch (UsernameNotFoundException e) {
            response = new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        return response;
    }


    @PreAuthorize("hasRole('ROLE_STUDENT')")
    @DeleteMapping("/{courseId}/unsubscribe")
    public ResponseEntity unsubscribe(Principal principal, @PathVariable Long courseId) {
        ResponseEntity response;

        try {
            Account account = (Account) accountDetailsService.loadUserByUsername(principal.getName());

            courseService.unsubscribe(account, courseId);

            response = new ResponseEntity<>(HttpStatus.OK);
        } catch (UsernameNotFoundException e) {
            response = new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        return response;
    }

}
