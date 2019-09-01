package ru.ifmo.se.iap.schoolOfPeopleX.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.ifmo.se.iap.schoolOfPeopleX.model.Ability;
import ru.ifmo.se.iap.schoolOfPeopleX.model.AbilityLevel;
import ru.ifmo.se.iap.schoolOfPeopleX.repository.AbilityLevelRepository;
import ru.ifmo.se.iap.schoolOfPeopleX.repository.AbilityRepository;
import ru.ifmo.se.iap.schoolOfPeopleX.model.Account;

import java.util.List;

@Transactional
@Service
public class AbilityService {
    private final AbilityRepository abilityRepository;
    private final AbilityLevelRepository abilityLevelRepository;

    public AbilityService(AbilityRepository abilityRepository, AbilityLevelRepository abilityLevelRepository) {
        this.abilityRepository = abilityRepository;
        this.abilityLevelRepository = abilityLevelRepository;
    }

    public List<Ability> getAll() {
        return this.abilityRepository.findAll();
    }

    public Ability getById(Long id) {
        return this.abilityRepository.getOne(id);
    }

    public List<AbilityLevel> getAllByAccount(Account currentAccount) {
        return this.abilityLevelRepository.findAllByAccount(currentAccount);
    }
}
