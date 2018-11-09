package com.izu.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.izu.type.Type;

public interface TypeRepository extends JpaRepository<Type, Integer> {

    Type findById(Integer id);
}
