package ru.ifmo.se.iap.schoolOfPeopleX.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.ifmo.se.iap.schoolOfPeopleX.model.Role;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Role findByName(final String name);
}
