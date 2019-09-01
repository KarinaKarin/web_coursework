package ru.ifmo.se.iap.schoolOfPeopleX.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.ifmo.se.iap.schoolOfPeopleX.model.Account;
import ru.ifmo.se.iap.schoolOfPeopleX.model.Rating;
import ru.ifmo.se.iap.schoolOfPeopleX.repository.RatingRepository;

@Transactional
@Service
public class RatingService {
    private final RatingRepository ratingRepository;

    public RatingService(RatingRepository ratingRepository) {
        this.ratingRepository = ratingRepository;
    }

    public Rating getRatingForStudent(Account student) {
        return new Rating();
    }
}
