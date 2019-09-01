package ru.ifmo.se.iap.schoolOfPeopleX.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.ifmo.se.iap.schoolOfPeopleX.model.Ability;
import ru.ifmo.se.iap.schoolOfPeopleX.model.AbilityLevel;
import ru.ifmo.se.iap.schoolOfPeopleX.model.Account;

import java.util.List;

public interface AbilityLevelRepository extends JpaRepository<AbilityLevel, Long> {
    List<AbilityLevel> findAllByAccount(Account account);
    AbilityLevel findByAbilityAndAccount(Ability ability, Account account);
}
