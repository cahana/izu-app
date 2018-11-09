package com.izu.service;

import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;
import java.util.Set;
import java.util.TreeSet;

import javax.annotation.PostConstruct;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.izu.repository.TypeRepository;
import com.izu.type.Type;



@Service
public class TypeService {

    private static final Log logger = LogFactory.getLog(TypeService.class);

    @Autowired
    private TypeRepository typeRepository;

    @Transactional(readOnly = true)
    @Cacheable(value = "typesAll")
    public List<Type> findAll() {
        return typeRepository.findAll(new Sort("id"));
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "typesById", key = "#id")
    public Type find(Integer id) {
        return typeRepository.findById(id);
    }

//    public TypeRepository getCampusRepository() {
//        return typeRepository;
//    }

//    public void setTypeRepository(TypeRepository typeRepository) {
//        this.typeRepository = typeRepository;
//    }
}
