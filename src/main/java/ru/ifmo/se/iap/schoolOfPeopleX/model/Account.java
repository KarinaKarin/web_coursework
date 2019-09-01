package ru.ifmo.se.iap.schoolOfPeopleX.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Type;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.*;
import javax.validation.constraints.Email;
import java.time.ZonedDateTime;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "account")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Account implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "username", nullable = false, unique = true)
    private String username;

    @Column(name = "birthday", nullable = false)
    private ZonedDateTime birthday;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(name = "hero_name", nullable = true)
    private String heroName;

    @JsonIgnore
    @Column(name = "password", nullable = false)
    private String password;

    @JsonIgnore
    @Column(name = "email_confirm", nullable = false)
    private Boolean emailConfirm;

    @JsonIgnore
    @Column(name = "enabled", nullable = false)
    private boolean enabled;

    @JsonIgnore
    @Column(name = "email_confirm_token", nullable = true)
    private String emailConfirmToken;

    @ManyToMany(fetch = FetchType.LAZY)
    private Set<Role> roles = new HashSet<>();

    @JsonIgnore
    @Column(nullable = true)
    @Type(type="org.hibernate.type.BinaryType")
    private byte[] avatar;

    @JsonIgnore
    @Column(nullable = true)
    private Integer avatarLength;

    @Column(nullable = true, length = 50)
    private String avatarType;



    public Account(
            @Email String email,
            ZonedDateTime birthday,
            String firstName,
            String lastName,
            String heroName,
            String password,
            Boolean emailConfirm,
            Boolean enabled,
            Set<Role> roles
    ) {
        this.email = email;
        this.username = email.split("@")[0];
        this.birthday = birthday;
        this.firstName = firstName;
        this.lastName = lastName;
        this.heroName = heroName;
        this.password = password;
        this.emailConfirm = emailConfirm;
        this.enabled = enabled;
        this.roles = roles;
    }

    public void setEmail(String email) {
        this.email = email;
        this.username = email.split("@")[0];
    }

    @JsonIgnore
    @Override
    public boolean isEnabled() {
        return this.enabled && this.emailConfirm;
    }

    @JsonIgnore
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles;
    }

    @JsonIgnore
    @Override
    public String getUsername() {
        return email;
    }

    @JsonIgnore
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @JsonIgnore
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @JsonIgnore
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }
}
