package ru.ifmo.se.iap.schoolOfPeopleX.configuration;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.dao.AbstractUserDetailsAuthenticationProvider;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import ru.ifmo.se.iap.schoolOfPeopleX.service.AccountDetailsService;

@Component
public class AccountAuthenticationProvider extends AbstractUserDetailsAuthenticationProvider{

    private final AccountDetailsService accountDetailsService;
    private final PasswordEncoder passwordEncoder;

    public AccountAuthenticationProvider(final AccountDetailsService accountDetailsService, final PasswordEncoder passwordEncoder){
        this.accountDetailsService = accountDetailsService;
        this.passwordEncoder = passwordEncoder;
    }


    @Override
    protected void additionalAuthenticationChecks(UserDetails userDetails, UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken) throws AuthenticationException {
        if (usernamePasswordAuthenticationToken.getCredentials() == null || userDetails.getPassword()==null){
            throw new BadCredentialsException("Credentials may not be null");
        }
        if (!passwordEncoder.matches((String) usernamePasswordAuthenticationToken.getCredentials(), userDetails.getPassword())){
            throw new BadCredentialsException("Invalid credentials");
        }
    }

    @Override
    protected UserDetails retrieveUser(String username, UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken) throws AuthenticationException {
        return accountDetailsService.loadUserByUsername(username);
    }
}
