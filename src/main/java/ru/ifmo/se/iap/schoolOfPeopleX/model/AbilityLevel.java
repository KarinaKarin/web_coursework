package ru.ifmo.se.iap.schoolOfPeopleX.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Table(name = "ability_level")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class AbilityLevel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    private Account account;

    @ManyToOne
    private Ability ability;

    @Column(name = "level", unique = false, nullable = false)
    private Long level;

    public AbilityLevel(Account account, Ability ability, Long level) {
        this.account = account;
        this.ability = ability;
        this.level = level;
    }
}