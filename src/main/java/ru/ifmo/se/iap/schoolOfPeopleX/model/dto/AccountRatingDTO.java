package ru.ifmo.se.iap.schoolOfPeopleX.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Email;
import java.time.ZonedDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AccountRatingDTO {
    private String firstName;
    private String lastName;
    private String heroName;
    private Double rating;
}
