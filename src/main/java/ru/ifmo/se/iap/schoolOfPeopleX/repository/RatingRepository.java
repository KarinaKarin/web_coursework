package ru.ifmo.se.iap.schoolOfPeopleX.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import ru.ifmo.se.iap.schoolOfPeopleX.model.Account;
import ru.ifmo.se.iap.schoolOfPeopleX.model.Lesson;
import ru.ifmo.se.iap.schoolOfPeopleX.model.Rating;

import java.util.List;

public interface RatingRepository extends JpaRepository<Rating, Long> {

    Rating findByLessonAndStudent(Lesson lesson, Account student);

    @Query(value = "select count(r.id) as id, count(r.lesson_id) as lesson_id, avg(r.rating) as rating, r.student_id from rating r where r.student_id=? group by r.student_id", nativeQuery = true)
    Rating findAverageByStudent(Long studentId);

    @Query(value = "select avg(r.rating) as rating, r.student_id as student_id from rating r group by r.student_id order by avg(r.rating) desc", nativeQuery = true)
    List<Object[]> findAllAverage();

    List<Rating> findAllByLesson(Lesson lesson);
}
