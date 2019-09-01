package ru.ifmo.se.iap.schoolOfPeopleX.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.config.annotation.configurers.ClientDetailsServiceConfigurer;
import org.springframework.security.oauth2.config.annotation.web.configuration.AuthorizationServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableAuthorizationServer;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;
import org.springframework.security.oauth2.config.annotation.web.configuration.ResourceServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configurers.AuthorizationServerEndpointsConfigurer;
import org.springframework.security.oauth2.config.annotation.web.configurers.ResourceServerSecurityConfigurer;
import org.springframework.security.oauth2.provider.token.store.JwtAccessTokenConverter;
import org.springframework.security.oauth2.provider.token.store.JwtTokenStore;

@Configuration
public class OAuth2ServerConfiguration {

    @Configuration
    @EnableResourceServer
    protected static class ResourceServerConfiguration extends ResourceServerConfigurerAdapter{

        private final JwtAccessTokenConverter jwtAccessTokenConverter;

        public ResourceServerConfiguration(JwtAccessTokenConverter jwtAccessTokenConverter) {
            this.jwtAccessTokenConverter = jwtAccessTokenConverter;
        }

        @Override
        public void configure(final ResourceServerSecurityConfigurer resource) throws Exception{
            resource.tokenStore(new JwtTokenStore(jwtAccessTokenConverter));
        }

        @Override
        public void configure(HttpSecurity httpSecurity) throws Exception{
            httpSecurity
                    .csrf()
                    .disable()
                    .authorizeRequests()
                    .antMatchers(
                            "/index.html", "/favicon.ico", "/assets/**",
                            "/*.js", "/*.js.map",
                            "/*.css", "/*.css.map",
                            "/*.png", "/*.gif", "/*.gif",
                            "/*.eot", "/*.svg", "/*.ttf", "/*.woff", "/*.woff2",
                            "/", "/auth", "/auth/registration", "/auth/recovery-password",
                            "/auth/", "/auth/registration/", "/auth/recovery-password/",
                            "/api/auth/register", "/api/auth/recovery-password", "/api/auth/email-confirm", "/api/auth/avatar/**", "/api/img/default-user-avatar.png"
                    )
                    .permitAll()
                    .anyRequest()
                    .authenticated();
        }
    }

    @Configuration
    @EnableAuthorizationServer
    protected static class AuthorizationServerConfiguration extends AuthorizationServerConfigurerAdapter{

        private final JwtAccessTokenConverter jwtAccessTokenConverter;
        private final PasswordEncoder passwordEncoder;
        private final AuthenticationManager authenticationManager;

        public AuthorizationServerConfiguration(JwtAccessTokenConverter jwtAccessTokenConverter, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager) {
            this.jwtAccessTokenConverter = jwtAccessTokenConverter;
            this.passwordEncoder = passwordEncoder;
            this.authenticationManager = authenticationManager;
        }

        @Override
        public void configure(final AuthorizationServerEndpointsConfigurer endpoints) throws Exception{
            endpoints
                    .tokenStore(new JwtTokenStore(jwtAccessTokenConverter))
                    .authenticationManager(authenticationManager)
                    .accessTokenConverter(jwtAccessTokenConverter);
        }

        @Override
        public void configure(final ClientDetailsServiceConfigurer clients) throws Exception{
            clients
                    .inMemory()
                    .withClient("school-of-people-x")
                    .secret(passwordEncoder.encode("school-of-people-x-secret"))
                    .authorizedGrantTypes("password", "refresh_token")
                    .scopes("read", "write")
                    .accessTokenValiditySeconds(-1)
                    .refreshTokenValiditySeconds(-1);
        }
    }
}
