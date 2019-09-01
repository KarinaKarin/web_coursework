package ru.ifmo.se.iap.schoolOfPeopleX.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourseDTO {

    private String title;
    private String description;
    private Long lessonsForPassed;
    private Long maximumStudents;
    private LocalDate courseStart;
    private LocalDate courseEnd;
    private Long abilityId;
    private Set<AbstractLessonDTO> abstractLessons = new HashSet<>();

}
