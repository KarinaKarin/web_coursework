package ru.ifmo.se.iap.schoolOfPeopleX.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ru.ifmo.se.iap.schoolOfPeopleX.model.Course;
import ru.ifmo.se.iap.schoolOfPeopleX.model.Lesson;
import ru.ifmo.se.iap.schoolOfPeopleX.repository.LessonRepository;
import ru.ifmo.se.iap.schoolOfPeopleX.service.CourseService;
import ru.ifmo.se.iap.schoolOfPeopleX.service.NotificationService;

import java.time.OffsetDateTime;
import java.util.Map;

import static java.lang.String.format;

@RestController
@RequestMapping("/api/lessons")
public class LessonController {

    @Value("${external.url}")
    private String externalUrl;

    private final LessonRepository lessonRepository;
    private final CourseService courseService;
    private final NotificationService notificationService;

    public LessonController(
            LessonRepository lessonRepository,
            CourseService courseService,
            NotificationService notificationService
    ) {
        this.notificationService = notificationService;
        this.courseService = courseService;
        this.lessonRepository = lessonRepository;
    }

    @PutMapping("/{lessonId}")
    @PreAuthorize("hasRole('ROLE_TEACHER')")
    public ResponseEntity changeLessonTime(
            @PathVariable Long lessonId,
            @RequestBody Map<String, OffsetDateTime> times
    ) {
        Lesson lesson = lessonRepository.getOne(lessonId);
        Course course = courseService.getOneByLessonId(lessonId);

        lesson.setLessonStart(times.get("lessonStart"));
        lesson.setLessonEnd(times.get("lessonEnd"));

        lessonRepository.save(lesson);

        notificationService.notify(
                "School of People X Lesson Time Changed!",
                format("%s, %s time changed: start - %s, end - %s",
                        getLessonLink(lesson),
                        getCourseLink(course),
                        lesson.getLessonStart().toString(),
                        lesson.getLessonEnd().toString()
                )
        );

        return new ResponseEntity(HttpStatus.OK);
    }

    @PutMapping("/{lessonId}/provided")
    @PreAuthorize("hasRole('ROLE_TEACHER')")
    public ResponseEntity changeLessonTime(
            @PathVariable Long lessonId
    ) {
        Lesson lesson = lessonRepository.getOne(lessonId);

        lesson.setProvided(true);

        lessonRepository.save(lesson);

        return new ResponseEntity(HttpStatus.OK);
    }

    @DeleteMapping("/{lessonId}")
    @PreAuthorize("hasRole('ROLE_TEACHER')")
    public ResponseEntity cancelLesson(
            @PathVariable Long lessonId
    ) {
        Lesson lesson = lessonRepository.getOne(lessonId);
        Course course = courseService.getOneByLessonId(lessonId);

        lesson.setCanceled(true);

        lessonRepository.save(lesson);

        notificationService.notify(
                "School of People X Lesson Canceled!",
                format("%s, %s canceled!",
                        getLessonLink(lesson),
                        getCourseLink(course)
                )
        );

        return new ResponseEntity(HttpStatus.OK);
    }

    private String getLessonLink(Lesson lesson) {
        return format("<a href=\"%s/lessons/%d\">Lesson #%d</a>", externalUrl, lesson.getId(), lesson.getId());
    }

    private String getCourseLink(Course course) {
        return format("<a href=\"%s/courses/%d\">\"%s\"</a>", externalUrl, course.getId(), course.getTitle());
    }
}
