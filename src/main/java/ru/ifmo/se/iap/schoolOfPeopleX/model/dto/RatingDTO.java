package ru.ifmo.se.iap.schoolOfPeopleX.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RatingDTO {
    private Long rating;
    private Long lessonId;
    private Long studentId;
}
