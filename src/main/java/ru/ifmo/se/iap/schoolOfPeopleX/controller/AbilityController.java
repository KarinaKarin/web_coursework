package ru.ifmo.se.iap.schoolOfPeopleX.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.ifmo.se.iap.schoolOfPeopleX.service.AbilityService;
import ru.ifmo.se.iap.schoolOfPeopleX.model.Account;
import ru.ifmo.se.iap.schoolOfPeopleX.service.AccountDetailsService;

import java.security.Principal;
import java.util.Optional;

@RestController
@RequestMapping("/api/abilities")
public class AbilityController {

    private final AbilityService abilityService;
    private final AccountDetailsService accountDetailsService;

    public AbilityController(AbilityService abilityService, AccountDetailsService accountDetailsService) {
        this.abilityService = abilityService;
        this.accountDetailsService = accountDetailsService;
    }

    @GetMapping
    public ResponseEntity getAll() {
        return new ResponseEntity<>(abilityService.getAll(), HttpStatus.OK);
    }

    @GetMapping("/my")
    public ResponseEntity getAllMy(Principal principal) {
        ResponseEntity response;

        try {
            Account currentAccount = (Account) accountDetailsService.loadUserByUsername(principal.getName());
            response = new ResponseEntity<>(abilityService.getAllByAccount(currentAccount), HttpStatus.OK);
        } catch (UsernameNotFoundException e) {
            response = new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return response;
    }

    @GetMapping("/{accountId}")
    public ResponseEntity getAllByUser(@PathVariable Long accountId) {

        Optional<Account> account = this.accountDetailsService.getAccountById(accountId);

        return account
                .map(value -> new ResponseEntity<>(abilityService.getAllByAccount(account.get()), HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
}
