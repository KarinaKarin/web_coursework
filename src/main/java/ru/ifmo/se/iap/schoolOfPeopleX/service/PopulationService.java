package ru.ifmo.se.iap.schoolOfPeopleX.service;

import com.github.javafaker.Faker;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.ifmo.se.iap.schoolOfPeopleX.model.*;
import ru.ifmo.se.iap.schoolOfPeopleX.repository.AbilityLevelRepository;
import ru.ifmo.se.iap.schoolOfPeopleX.repository.AbilityRepository;
import ru.ifmo.se.iap.schoolOfPeopleX.repository.AccountRepository;
import ru.ifmo.se.iap.schoolOfPeopleX.repository.RoleRepository;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.OffsetTime;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static java.lang.String.format;

@Transactional
@Service
public class PopulationService {
    private final Faker faker;
    private final PasswordEncoder passwordEncoder;
    private final AccountRepository accountRepository;
    private final RoleRepository roleRepository;
    private final AbilityRepository abilityRepository;
    private final AbilityLevelRepository abilityLevelRepository;
    private final CourseService courseService;

    public PopulationService(
            final RoleRepository roleRepository,
            final Faker faker,
            final PasswordEncoder passwordEncoder,
            final AccountRepository accountRepository,
            final AbilityRepository abilityRepository,
            final AbilityLevelRepository abilityLevelRepository,
            final CourseService courseService
    ) {
        this.passwordEncoder = passwordEncoder;
        this.faker = faker;

        this.accountRepository = accountRepository;
        this.roleRepository = roleRepository;
        this.abilityRepository = abilityRepository;
        this.abilityLevelRepository = abilityLevelRepository;
        this.courseService = courseService;
    }

    public void populate() {
        final Role roleStudent = roleRepository.save(new Role("ROLE_STUDENT", faker.lorem().paragraph()));
        final Role roleTeacher = roleRepository.save(new Role("ROLE_TEACHER", faker.lorem().paragraph()));
        final Role roleAdministrator = roleRepository.save(new Role("ROLE_ADMIN", faker.lorem().paragraph()));

        final Account noreply = accountRepository.save(buildPrimaryUser("noreply@x-men.com", Stream.of(roleAdministrator).collect(Collectors.toCollection(HashSet::new))));
        final Account student = accountRepository.save(buildPrimaryUser("student@x-men.com", Stream.of(roleStudent).collect(Collectors.toCollection(HashSet::new))));
        final Account teacher = accountRepository.save(buildPrimaryUser("teacher@x-men.com", Stream.of(roleTeacher).collect(Collectors.toCollection(HashSet::new))));

        final Account administrator = accountRepository.save(buildPrimaryUser("admin@x-men.com", Stream.of(roleTeacher, roleAdministrator).collect(Collectors.toCollection(HashSet::new))));

        for(int i = 2; i < 25; i++) {
            accountRepository.save(buildPrimaryUser(format("student%d@x-men.com", i), Stream.of(roleStudent).collect(Collectors.toCollection(HashSet::new))));
        }

        buildAccounts(roleTeacher, 30);
        buildAccounts(roleStudent, 100);

        Set<Ability> newAbilities = new HashSet<>();
        for (int i = 0; i < 500; i++) {
            Ability newAbility = new Ability(faker.superhero().power(), faker.lorem().paragraph());

            if (newAbilities.stream().noneMatch(ability -> newAbility.getTitle().equals(ability.getTitle())))
                newAbilities.add(newAbility);
        }
        List<Ability> abilities = abilityRepository.saveAll(newAbilities);

        for (Account account: this.accountRepository.findAll()) {
            Set<AbilityLevel> actualAbilities = new HashSet<>();
            for (int i = 0; i < faker.number().numberBetween(1, 10); i++)
                actualAbilities.add(new AbilityLevel(account, abilities.get(faker.number().numberBetween(0, abilities.size() - 1)), (long) faker.number().numberBetween(1, 100)));
            this.abilityLevelRepository.saveAll(actualAbilities);
        }

        List<Account> students = accountRepository.findAll()
                .stream()
                .filter(account -> account.getRoles().contains(roleStudent))
                .collect(Collectors.toList());

        abilities.forEach(ability -> {
            Course course = new Course();

            course.setTitle(format("SPX COURSE %s", ability.getTitle()));
            course.setAbility(ability);
            course.setLessonsForPassed(10L);
            course.setMaximumStudents(30L);

            course.setTeacher(teacher);

            course.setDescription(format("SPX COURSE %s, %s", ability.getTitle(), faker.lorem().paragraph()));

            course.setCourseStart(LocalDate.now());
            course.setCourseEnd(LocalDate.now().plus(6L, ChronoUnit.MONTHS));

            course.setStudents(students.stream()
                    .filter(account -> faker.bool().bool())
                    .limit(faker.number().numberBetween(5, 10))
                    .collect(Collectors.toSet()));

            Set<AbstractLesson> abstractLessons = new HashSet<>();

            for (int i = 1; i <= faker.number().numberBetween(1, 3); i++) {
                AbstractLesson abstractLesson = new AbstractLesson();

                abstractLesson.setLessonStart(OffsetTime.parse("10:30:00+03:00"));
                abstractLesson.setLessonEnd(OffsetTime.parse("12:30:00+03:00"));
                abstractLesson.setDayOfWeek(DayOfWeek.of(faker.number().numberBetween(1, 7)));

                abstractLessons.add(abstractLesson);
            }

            course.setAbstractLessons(abstractLessons);

            courseService.crateCourse(course, false);
        });
    }

    private void buildAccounts(Role role, int count) {
        List<Account> accounts = new ArrayList<>();

        for (int i = 0; i < count; i++) {
            Account newAccount = buildUser(Stream.of(role).collect(Collectors.toCollection(HashSet::new)));
            if (accounts.stream().noneMatch(account -> account.getEmail().equals(newAccount.getEmail())))
                accounts.add(newAccount);
        }

        try {
            this.accountRepository.saveAll(accounts);
        } catch(Exception ignored) {

        }
    }

    private Account buildPrimaryUser(String email, Set<Role> roles) {
        Account account = buildUser(roles);

        account.setEmail(email);

        return account;
    }

    private Account buildUser(Set<Role> roles) {
        return new Account(
                faker.internet().emailAddress(),
                ZonedDateTime.now(),
                faker.name().firstName(),
                faker.name().lastName(),
                faker.superhero().name(),
                passwordEncoder.encode("derparol"),
                true,
                true,
                roles
        );
    }
}
