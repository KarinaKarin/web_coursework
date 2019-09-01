package ru.ifmo.se.iap.schoolOfPeopleX.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.DayOfWeek;
import java.time.OffsetTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AbstractLessonDTO {
    private DayOfWeek dayOfWeek;
    private OffsetTime lessonStart;
    private OffsetTime lessonEnd;
}
