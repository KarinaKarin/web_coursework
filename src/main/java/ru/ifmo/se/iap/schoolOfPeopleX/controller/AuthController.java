package ru.ifmo.se.iap.schoolOfPeopleX.controller;

import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ru.ifmo.se.iap.schoolOfPeopleX.model.Account;
import ru.ifmo.se.iap.schoolOfPeopleX.model.dto.AccountDTO;
import ru.ifmo.se.iap.schoolOfPeopleX.model.dto.PasswordRecoveryDTO;
import ru.ifmo.se.iap.schoolOfPeopleX.service.AccountDetailsService;

import javax.mail.MessagingException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.security.Principal;
import java.time.OffsetDateTime;
import java.time.ZonedDateTime;

import static java.lang.String.format;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Value("${external.url}")
    private String externalUrl;

    private final AccountDetailsService accountDetailsService;
    private final PasswordEncoder passwordEncoder;

    public AuthController(final AccountDetailsService accountDetailsService, final PasswordEncoder passwordEncoder) {
        this.accountDetailsService = accountDetailsService;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/me")
    public ResponseEntity getCurrentAccount(Principal principal) {
        ResponseEntity response;

        try {
            response = new ResponseEntity<>(
                    accountDetailsService.loadUserByUsername(principal.getName()),
                    HttpStatus.OK
            );
        } catch (UsernameNotFoundException e) {
            response = new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return response;
    }

    @PostMapping("/register")
    public ResponseEntity registerAccount(@RequestBody AccountDTO accountDTO) throws MessagingException {
        ResponseEntity response;

        if (accountDTO != null
                && !accountDetailsService.checkEmail(accountDTO.getEmail())
                && accountDTO.getBirthday() != null
                && accountDTO.getBirthday().isBefore(ZonedDateTime.now())
                && accountDTO.getPassword() != null
                && accountDTO.getPasswordConfirm() != null
                && accountDTO.getPassword().equals(accountDTO.getPasswordConfirm())) {
            Account account = new Account();

            account.setEmail(accountDTO.getEmail());
            account.setBirthday(accountDTO.getBirthday());
            account.setFirstName(accountDTO.getFirstName());
            account.setLastName(accountDTO.getLastName());
            account.setHeroName(accountDTO.getHeroName());
            account.setPassword(passwordEncoder.encode(accountDTO.getPassword()));

            response = new ResponseEntity<>(accountDetailsService.registerAccount(account), HttpStatus.OK);
        } else {
            response = new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        return response;
    }

    @PostMapping("/recovery-password")
    public ResponseEntity recoveryPassword(@RequestBody PasswordRecoveryDTO passwordRecovery) {
        ResponseEntity response;

        try {
            Account account = (Account) accountDetailsService.loadUserByUsername(passwordRecovery.getEmail());

            accountDetailsService.recoveryPassword(account);

            response = new ResponseEntity<>(HttpStatus.OK);
        } catch (UsernameNotFoundException e) {
            response = new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return response;
    }

    @GetMapping("/email-confirm")
    public ResponseEntity confirmEmail(@RequestParam("token") String token, @RequestParam("email") String email) {
        ResponseEntity response;

        try {
            final String location;

            if (accountDetailsService.confirmEmail(email, token)) {
                location = format("%s/auth?emailConfirmed=%s", externalUrl, email);
            } else {
                location = format("%s/auth", externalUrl);
            }

            final HttpHeaders headers = new HttpHeaders();

            headers.add(HttpHeaders.LOCATION, location);

            response = new ResponseEntity<>(headers, HttpStatus.FOUND);
        } catch (UsernameNotFoundException e) {
            response = new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        return response;
    }

    @PutMapping("/update")
    public ResponseEntity update(
            Principal principal,
            @RequestParam String firstName,
            @RequestParam String lastName,
            @RequestParam String heroName,
            @RequestParam String birthday,
            @RequestParam(name = "avatar", required = false) MultipartFile avatar
    ) {
        ResponseEntity response;

        try {
            Account account = (Account) accountDetailsService.loadUserByUsername(principal.getName());

            account.setFirstName(firstName);
            account.setLastName(lastName);
            account.setHeroName(heroName);
            account.setBirthday(ZonedDateTime.parse(birthday));

            if (!(avatar == null || avatar.isEmpty())) {
                account.setAvatarLength(Long.valueOf(avatar.getSize()).intValue());
                account.setAvatarType(avatar.getContentType());
                account.setAvatar(IOUtils.toByteArray(avatar.getInputStream()));
            }

            response = new ResponseEntity<>(accountDetailsService.saveAccount(account), HttpStatus.OK);
        } catch (UsernameNotFoundException e) {
            response = new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (IOException e) {
            response = new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return response;
    }

    @GetMapping("/avatar")
    public void avatar(
            Principal principal,
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        Account account = (Account) accountDetailsService.loadUserByUsername(principal.getName());

        getAvatarByAccount(account, response);
    }

    @GetMapping("/avatar/{id}")
    public void avatar(
            @PathVariable Long id,
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        Account account = accountDetailsService.getAccountById(id).get();

        getAvatarByAccount(account, response);
    }

    private void getAvatarByAccount(Account account, HttpServletResponse response) {
        try {
            response.setHeader("Content-Disposition", String.format("inline;filename=\"%s\"", account.getHeroName()));

            if (account.getAvatar() == null) {
                response.sendRedirect("/api/img/default-user-avatar.png");
            } else {
                OutputStream out = response.getOutputStream();
                response.setContentType(account.getAvatarType());
                response.setContentLength(account.getAvatarLength());
                IOUtils.copy(new ByteArrayInputStream(account.getAvatar()), out);

                out.flush();
                out.close();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
