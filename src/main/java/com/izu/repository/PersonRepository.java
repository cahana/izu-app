package com.izu.repository;

import com.izu.type.Person;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PersonRepository extends JpaRepository<Person, Integer> {

    @Override
    List<Person> findAll();

    Person findById(Integer id);

    Person findByEmail(String email);
}
