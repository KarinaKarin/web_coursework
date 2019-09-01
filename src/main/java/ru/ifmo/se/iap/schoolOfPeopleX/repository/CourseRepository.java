package ru.ifmo.se.iap.schoolOfPeopleX.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import ru.ifmo.se.iap.schoolOfPeopleX.model.Account;
import ru.ifmo.se.iap.schoolOfPeopleX.model.Course;

import java.util.List;

public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findAllByStudentsContains(Account student);
    List<Course> findAllByTeacher(Account teacher);

    @Query(value = "select distinct c.* from course c " +
            "join account t on c.teacher_id = t.id " +
            "join ability a on c.ability_id = a.id " +
            "where c.title ilike ? " +
            "and t.hero_name ilike ? " +
            "and a.title ilike ?", nativeQuery = true)
    List<Course> findAllByNameAndTeacherAndAbility(String title, String teacherHeroName, String abilityTitle);

    @Query(value = "select distinct c.* from course c " +
            "join account t on c.teacher_id = t.id " +
            "join ability a on c.ability_id = a.id " +
            "join abstract_lesson al on c.id = al.course_id " +
            "where c.title ilike ? " +
            "and t.hero_name ilike ? " +
            "and a.title ilike ? " +
            "and al.day_of_week = ?", nativeQuery = true)
    List<Course> findAllByNameAndTeacherAndAbilityAndDyOfWeek(String title, String teacherHeroName, String abilityTitle, Integer dayOfWeek);

    @Query(value = "select distinct c.* from course c " +
            "join abstract_lesson al on c.id = al.course_id " +
            "join lesson l on al.id = l.abstract_lesson_id " +
            "where l.id=? limit 1", nativeQuery = true)
    Course findByLessonId(Long lessonId);
}
