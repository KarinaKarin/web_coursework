package ru.ifmo.se.iap.schoolOfPeopleX.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.ifmo.se.iap.schoolOfPeopleX.model.*;
import ru.ifmo.se.iap.schoolOfPeopleX.repository.AbilityLevelRepository;
import ru.ifmo.se.iap.schoolOfPeopleX.repository.AbstractLessonRepository;
import ru.ifmo.se.iap.schoolOfPeopleX.repository.CourseRepository;
import ru.ifmo.se.iap.schoolOfPeopleX.repository.LessonRepository;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.LongStream;

import static java.lang.String.format;

@Transactional
@Service
public class CourseService {
    private final CourseRepository courseRepository;
    private final AbilityLevelRepository abilityLevelRepository;
    private final AbstractLessonRepository abstractLessonRepository;
    private final LessonRepository lessonRepository;
    private final NotificationService notificationService;

    public CourseService(
            CourseRepository courseRepository,
            NotificationService notificationService,
            LessonRepository lessonRepository,
            AbilityLevelRepository abilityLevelRepository,
            AbstractLessonRepository abstractLessonRepository
    ) {
        this.courseRepository = courseRepository;
        this.abstractLessonRepository = abstractLessonRepository;
        this.lessonRepository = lessonRepository;
        this.notificationService = notificationService;
        this.abilityLevelRepository = abilityLevelRepository;
    }

    public Course crateCourse(Course course, Boolean notify) {
        course.setAbstractLessons(new HashSet<>(abstractLessonRepository.saveAll(course.getAbstractLessons())));

        Course createdCourse = courseRepository.save(course);

        LongStream
                .range(createdCourse.getCourseStart().toEpochDay(), createdCourse.getCourseEnd().toEpochDay())
                .mapToObj(LocalDate::ofEpochDay)
                .forEach(date -> {
                    Optional<AbstractLesson> optionalAbstractLesson = createdCourse
                            .getAbstractLessons()
                            .stream()
                            .filter(lesson -> lesson.getDayOfWeek().equals(date.getDayOfWeek()))
                            .findFirst();

                    if (optionalAbstractLesson.isPresent()) {
                        AbstractLesson abstractLesson = optionalAbstractLesson.get();

                        Lesson lesson = new Lesson();

                        lesson.setLessonStart(OffsetDateTime.of(
                                date,
                                abstractLesson.getLessonStart().toLocalTime(),
                                abstractLesson.getLessonStart().getOffset()
                        ));
                        lesson.setLessonEnd(OffsetDateTime.of(
                                date,
                                abstractLesson.getLessonEnd().toLocalTime(),
                                abstractLesson.getLessonEnd().getOffset()
                        ));

                        abstractLesson.getLessons().add(lessonRepository.save(lesson));
                    }
                });

        abstractLessonRepository.saveAll(createdCourse.getAbstractLessons());

        if (notify) {
            notificationService.notify(
                    "School of People X New Course!",
                    format("New \"%s\" course, teacher - \"%s\"",
                            createdCourse.getTitle(),
                            createdCourse.getTeacher().getHeroName())
            );
        }

        return createdCourse;
    }

    public List<Course> getAll(String title, String teacherHeroName, String abilityTitle, Integer dayOfWeek) {
        if (dayOfWeek != null) {
            return courseRepository.findAllByNameAndTeacherAndAbilityAndDyOfWeek(
                    title != null ? format("%%%s%%", title) : "%",
                    teacherHeroName != null ? format("%%%s%%", teacherHeroName) : "%",
                    abilityTitle != null ? format("%%%s%%", abilityTitle) : "%",
                    DayOfWeek.of(dayOfWeek).ordinal()
            );
        } else {
            return courseRepository.findAllByNameAndTeacherAndAbility(
                    title != null ? format("%%%s%%", title) : "%",
                    teacherHeroName != null ? format("%%%s%%", teacherHeroName) : "%",
                    abilityTitle != null ? format("%%%s%%", abilityTitle) : "%"
            );
        }
    }

    public List<Course> getAllByStudent(Account student) {
        return courseRepository.findAllByStudentsContains(student);
    }

    public List<Course> getAllByTeacher(Account teacher) {
        return courseRepository.findAllByTeacher(teacher);
    }

    public Course getOne(Long id) {
        return courseRepository.getOne(id);
    }

    public Course getOneByLessonId(Long lessonId) {
        return courseRepository.findByLessonId(lessonId);
    }

    public void subscribe(Account account, Long courseId) {
        Course course = courseRepository.getOne(courseId);

        course.getStudents().add(account);

        courseRepository.save(course);

        Ability ability = course.getAbility();

        List<AbilityLevel> abilityLevels = abilityLevelRepository.findAllByAccount(account);

        if (abilityLevels
                .stream()
                .noneMatch(abilityLevel -> abilityLevel.getAbility().equals(ability))) {
            AbilityLevel abilityLevel = new AbilityLevel();

            abilityLevel.setAccount(account);
            abilityLevel.setAbility(ability);
            abilityLevel.setLevel(0L);

            abilityLevelRepository.save(abilityLevel);
        }
    }

    public void unsubscribe(Account account, Long courseId) {
        Course course = courseRepository.getOne(courseId);

        course.getStudents().remove(account);

        courseRepository.save(course);
    }
}
