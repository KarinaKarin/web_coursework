package ru.ifmo.se.iap.schoolOfPeopleX.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import ru.ifmo.se.iap.schoolOfPeopleX.model.Account;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface AccountRepository extends JpaRepository<Account, Long> {

    Optional<Account> findByEmail(final String email);

    @Query(value = "select distinct ac.* from account ac " +
            "join ability_level al on ac.id = al.account_id " +
            "join ability a on al.ability_id = a.id " +
            "join account_roles ar on ac.id = ar.account_id " +
            "join role r on ar.roles_id = r.id " +
            "where r.name = 'ROLE_TEACHER' and ac.first_name ilike ?1 and ac.last_name ilike ?2 and a.title ilike ?3",
            nativeQuery = true)
    List<Account> findAllByTeachers(String firstName, String lastName, String ability);

    @Query(value = "select email from account where email_confirm = true", nativeQuery = true)
    Set<String> findEmails();
}
