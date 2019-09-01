package ru.ifmo.se.iap.schoolOfPeopleX.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.ifmo.se.iap.schoolOfPeopleX.repository.AccountRepository;

@Transactional
@Service
public class NotificationService {
    private final EmailService emailService;
    private final AccountRepository accountRepository;
    private final AsyncService asyncService;

    public NotificationService(
            final EmailService emailService,
            final AccountRepository accountRepository,
            final AsyncService asyncService
    ) {
        this.emailService = emailService;
        this.accountRepository = accountRepository;
        this.asyncService = asyncService;
    }

    public void notify(final String subject, final String message) {
        try {
            asyncService.async(() -> emailService.sendMessage(accountRepository.findEmails(), subject, message));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
