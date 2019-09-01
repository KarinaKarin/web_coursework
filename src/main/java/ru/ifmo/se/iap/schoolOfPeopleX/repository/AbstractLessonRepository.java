package ru.ifmo.se.iap.schoolOfPeopleX.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.ifmo.se.iap.schoolOfPeopleX.model.AbstractLesson;

public interface AbstractLessonRepository extends JpaRepository<AbstractLesson, Long> {
}