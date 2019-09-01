package ru.ifmo.se.iap.schoolOfPeopleX.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ru.ifmo.se.iap.schoolOfPeopleX.model.*;
import ru.ifmo.se.iap.schoolOfPeopleX.model.dto.RatingDTO;
import ru.ifmo.se.iap.schoolOfPeopleX.repository.AbilityLevelRepository;
import ru.ifmo.se.iap.schoolOfPeopleX.repository.CourseRepository;
import ru.ifmo.se.iap.schoolOfPeopleX.repository.LessonRepository;
import ru.ifmo.se.iap.schoolOfPeopleX.repository.RatingRepository;
import ru.ifmo.se.iap.schoolOfPeopleX.service.AccountDetailsService;
import ru.ifmo.se.iap.schoolOfPeopleX.service.CourseService;
import ru.ifmo.se.iap.schoolOfPeopleX.service.NotificationService;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static java.lang.String.format;

@RestController
@RequestMapping("/api/rating")
public class RatingController {

    private final RatingRepository ratingRepository;
    private final LessonRepository lessonRepository;
    private final AbilityLevelRepository abilityLevelRepository;
    private final AccountDetailsService accountDetailsService;
    private final CourseRepository courseRepository;
    private final NotificationService notificationService;

    @Value("${external.url}")
    private String externalUrl;

    public RatingController(
            RatingRepository ratingRepository,
            AccountDetailsService accountDetailsService,
            LessonRepository lessonRepository,
            AbilityLevelRepository abilityLevelRepository,
            CourseRepository courseRepository,
            NotificationService notificationService
    ) {
        this.ratingRepository = ratingRepository;
        this.accountDetailsService = accountDetailsService;
        this.lessonRepository = lessonRepository;
        this.abilityLevelRepository = abilityLevelRepository;
        this.courseRepository = courseRepository;
        this.notificationService = notificationService;
    }

    @GetMapping("/student")
    public ResponseEntity getAllRatings(
            @RequestParam Long studentId
    ) {
        return new ResponseEntity<>(ratingRepository.findAverageByStudent(studentId), HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity getAll(
            @RequestParam(required = false) Long lessonId,
            @RequestParam(required = false) Boolean average
    ) {
        if (lessonId != null) {
            Lesson lesson = lessonRepository.getOne(lessonId);

            return new ResponseEntity<>(ratingRepository.findAllByLesson(lesson), HttpStatus.OK);
        } else if (average != null && average) {
            return new ResponseEntity<>(ratingRepository.findAllAverage()
                    .stream()
                    .map(item -> {
                        Rating rating = new Rating();

                        rating.setRating(((BigDecimal) item[0]).longValue());
                        rating.setStudent(accountDetailsService.getAccountById(((BigInteger) item[1]).longValue()).get());

                        return rating;
                    }), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(ratingRepository.findAll(), HttpStatus.OK);
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('ROLE_TEACHER')")
    public ResponseEntity createRatings(@RequestBody List<RatingDTO> dtos) {
        ratingRepository.saveAll(dtos
                .stream()
                .map(dto -> {
                    Lesson lesson = lessonRepository.getOne(dto.getLessonId());
                    Account student = accountDetailsService.getAccountById(dto.getStudentId()).get();
                    Course course = courseRepository.findByLessonId(lesson.getId());
                    Ability ability = course.getAbility();

                    AbilityLevel abilityLevel = abilityLevelRepository.findByAbilityAndAccount(ability, student);

                    if (abilityLevel == null) {
                        abilityLevel = new AbilityLevel();

                        abilityLevel.setLevel(0L);
                        abilityLevel.setAbility(ability);
                        abilityLevel.setAccount(student);
                    }

                    abilityLevel.setLevel(abilityLevel.getLevel() + (100 / course.getLessonsForPassed()));

                    if (abilityLevel.getLevel() >= 100) {
                        abilityLevel.setLevel(100L);
                        course.getStudents().remove(student);
                        courseRepository.save(course);

                        notificationService.notify(
                                "School of People X The student learned a new ability!",
                                format("The student, %s (%s %s), finished the %s and learned a new ability - \"%s\"!",
                                        student.getHeroName(),
                                        student.getFirstName(),
                                        student.getLastName(),
                                        getCourseLink(course),
                                        ability.getTitle())
                        );
                    }

                    abilityLevelRepository.save(abilityLevel);

                    Rating rating = ratingRepository.findByLessonAndStudent(lesson, student);

                    if (rating == null) {
                        rating = new Rating();
                        rating.setStudent(student);
                        rating.setLesson(lesson);
                    }

                    rating.setRating(dto.getRating());

                    return rating;
                })
                .collect(Collectors.toList()));

        return new ResponseEntity(HttpStatus.OK);
    }

    private String getCourseLink(Course course) {
        return format("<a href=\"%s/courses/%d\">\"%s\"</a>", externalUrl, course.getId(), course.getTitle());
    }
}
