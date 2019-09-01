package ru.ifmo.se.iap.schoolOfPeopleX.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "course")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description", nullable = false, length = 4096)
    private String description;

    @Column(nullable = false)
    private Long lessonsForPassed;

    @Column(nullable = false)
    private Long maximumStudents;

    @Column(nullable = false)
    private LocalDate courseStart;

    @Column(nullable = false)
    private LocalDate courseEnd;

    @ManyToOne(fetch = FetchType.EAGER)
    private Ability ability;

    @ManyToOne(fetch = FetchType.EAGER)
    private Account teacher;

    @ManyToMany(fetch = FetchType.EAGER)
    private Set<Account> students = new HashSet<>();

    @OneToMany(fetch = FetchType.EAGER)
    @JoinColumn(name = "course_id")
    private Set<AbstractLesson> abstractLessons = new HashSet<>();
}
