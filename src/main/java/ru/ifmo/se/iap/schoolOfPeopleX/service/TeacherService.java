package ru.ifmo.se.iap.schoolOfPeopleX.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.ifmo.se.iap.schoolOfPeopleX.model.Account;
import ru.ifmo.se.iap.schoolOfPeopleX.repository.AccountRepository;

import java.util.List;
import java.util.Optional;

import static java.lang.String.format;

@Transactional
@Service
public class TeacherService {

    private final AccountRepository accountRepository;

    public TeacherService(final AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    public List<Account> getAllProfilesByFilters(String firstName, String lastName, String ability, Boolean onlyMy) {
        return this.accountRepository.findAllByTeachers(
                firstName != null ? format("%%%s%%", firstName) : "%",
                lastName != null ? format("%%%s%%", lastName) : "%",
                ability != null ? format("%%%s%%", ability) : "%"
        );
    }

    public Optional<Account> getOne(Long id) {
        return this.accountRepository.findById(id);
    }
}
