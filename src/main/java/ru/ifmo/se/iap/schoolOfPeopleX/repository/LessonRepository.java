package ru.ifmo.se.iap.schoolOfPeopleX.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.ifmo.se.iap.schoolOfPeopleX.model.Lesson;

public interface LessonRepository extends JpaRepository<Lesson, Long> {
}