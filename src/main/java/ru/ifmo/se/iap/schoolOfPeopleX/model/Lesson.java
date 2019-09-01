package ru.ifmo.se.iap.schoolOfPeopleX.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "lesson")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Lesson {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private OffsetDateTime lessonStart;

    @Column(nullable = false)
    private OffsetDateTime lessonEnd;

    @Column(nullable = true)
    private Boolean canceled;

    @Column(nullable = true)
    private Boolean provided;
}
