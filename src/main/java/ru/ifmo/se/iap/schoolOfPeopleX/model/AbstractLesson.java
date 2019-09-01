package ru.ifmo.se.iap.schoolOfPeopleX.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.DayOfWeek;
import java.time.OffsetTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "abstract_lesson")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class AbstractLesson {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private DayOfWeek dayOfWeek;

    @Column(nullable = false)
    private OffsetTime lessonStart;

    @Column(nullable = false)
    private OffsetTime lessonEnd;

    @OneToMany
    @JoinColumn(name = "abstract_lesson_id")
    private Set<Lesson> lessons = new HashSet<>();

}
