package ru.ifmo.se.iap.schoolOfPeopleX.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Email;
import java.time.ZonedDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AccountDTO {
    @Email
    private String email;
    private ZonedDateTime birthday;
    private String firstName;
    private String lastName;
    private String heroName;
    private String password;
    private String passwordConfirm;
}
