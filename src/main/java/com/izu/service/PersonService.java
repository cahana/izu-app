package com.izu.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.izu.repository.PersonRepository;
import com.izu.type.Person;

@Service
public class PersonService {

    @Autowired
    private PersonRepository personRepository;

    @Transactional(readOnly = true)
    @Cacheable(value = "personByIdCache", key = "#id")
    public Person findById(Integer id) {
        return personRepository.findById(id);
    }

    public Person findPersonByEmail(String email) {
        Person person = personRepository.findByEmail(email);
        return person != null ? person : new Person();
    }

    @Cacheable(value = "personCache")
    public List<Person> findPersons() {
        return personRepository.findAll();
    }

    public List<Person> findAll() {
        return personRepository.findAll();
    }

    @Transactional
    @Caching(put = @CachePut(value = "personByIdCache", key = "#result.id"),
            evict = @CacheEvict(value = "personCache", allEntries = true))
    public Person addPerson(String email, String lastName, String firstName) {

        Person person = new Person();
        person.setEmail(email);
        person.setLastName(lastName);
        person.setLastName(firstName);
        person = personRepository.save(person);
        
        return person;
    }

    @Caching(evict = {
            @CacheEvict(value = "personCache", allEntries = true),
            @CacheEvict(value = "personByIdCache", key = "#person.id") })
    public void delete(Person person) {
        personRepository.delete(person);
    }

    @Caching(evict = {
            @CacheEvict(value = "personCache", allEntries = true),
            @CacheEvict(value = "personByIdCache", allEntries = true) })
    public void evictPersonCaches() {
        // Empty.
    }

}
