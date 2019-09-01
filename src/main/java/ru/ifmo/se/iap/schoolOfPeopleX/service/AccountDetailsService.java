package ru.ifmo.se.iap.schoolOfPeopleX.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.ifmo.se.iap.schoolOfPeopleX.model.Account;
import ru.ifmo.se.iap.schoolOfPeopleX.repository.AccountRepository;
import ru.ifmo.se.iap.schoolOfPeopleX.repository.RoleRepository;

import javax.mail.MessagingException;
import java.util.Collections;
import java.util.Optional;
import java.util.UUID;

import static java.lang.String.format;

@Transactional
@Service
public class AccountDetailsService implements UserDetailsService {

    @Value("${external.url}")
    private String externalUrl;

    private final AccountRepository accountRepository;
    private final AsyncService asyncService;
    private final RoleRepository roleRepository;
    private final EmailService emailService;

    public AccountDetailsService(EmailService emailService, AccountRepository accountRepository, RoleRepository roleRepository, AsyncService asyncService) {
        this.accountRepository = accountRepository;
        this.roleRepository = roleRepository;
        this.emailService = emailService;
        this.asyncService = asyncService;
    }

    @Override
    public UserDetails loadUserByUsername(final String username) throws UsernameNotFoundException {
        final Optional<Account> accountByEmail = accountRepository.findByEmail(username);

        if (!accountByEmail.isPresent()){
            throw new UsernameNotFoundException("Login failed because username " +accountByEmail+" is not found !");

        }

        final Account account = accountByEmail.get();
        if (account.getRoles() == null || account.getRoles().isEmpty()){
            throw new UsernameNotFoundException("authorize request is failed ");
        }

        return account;
    }

    public Account registerAccount(final Account account) {
        account.setEnabled(true);
        account.setRoles(Collections.singleton(this.roleRepository.findByName("ROLE_STUDENT")));
        account.setEmailConfirm(false);
        account.setEmailConfirmToken(UUID.randomUUID().toString());

        Account savedAccount = accountRepository.save(account);

        asyncService.async(() -> emailService.sendMessage(
                savedAccount.getEmail(),
                "School of People X Registration Confirm",
                format(
                        "Please, click on <a href=\"%s/api/auth/email-confirm?token=%s&email=%s\">link</a> to confirm your email",
                        externalUrl,
                        savedAccount.getEmailConfirmToken(),
                        savedAccount.getEmail()
                )
        ));

        return savedAccount;
    }

    public Account saveAccount(final Account account) {
        return accountRepository.save(account);
    }

    public void recoveryPassword(final Account account) {
        asyncService.async(() -> emailService.sendMessage(
                account.getEmail(),
                "School of People X Password Recovery",
                format("Your password is \"%s\"", account.getPassword())
        ));
    }

    public Optional<Account> getAccountById(final Long accountId) {
        return this.accountRepository.findById(accountId);
    }

    public Boolean checkEmail(String email) {
        return accountRepository
                .findByEmail(email)
                .isPresent();
    }

    public Boolean confirmEmail(String email, String token) throws UsernameNotFoundException {
        Account account = (Account) loadUserByUsername(email);

        if (account.getEmailConfirmToken() != null && account.getEmailConfirmToken().equals(token)) {
            account.setEmailConfirmToken(null);
            account.setEmailConfirm(true);

            return true;
        }

        return false;
    }
}
