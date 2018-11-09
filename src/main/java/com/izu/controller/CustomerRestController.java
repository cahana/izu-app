package com.izu.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import com.izu.service.PersonService;
import com.izu.service.TypeService;
import com.izu.type.Person;
import com.izu.type.Type;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class CustomerRestController {

    private static final Log logger = LogFactory.getLog(CustomerRestController.class);

    @Autowired
    private PersonService personService;

    @Autowired
    private TypeService typeService;

    @GetMapping("/api/customer/{id}")
    public ResponseEntity<Person> application(@PathVariable Integer id) {
        logger.info("Entered REST customer id: " + id);
        Person data = personService.findById(id);
        return ResponseEntity
                .ok()
                .body(data);
    }

    @GetMapping("/api/customers")
    public ResponseEntity<List<Person>> customers() {
        logger.debug("Entered REST customers...");
        List<Person> data = personService.findAll();
        return ResponseEntity
                .ok()
                .body(data);
    }

    @GetMapping("/api/types")
    public ResponseEntity<List<Type>> types() {
        logger.debug("Entered REST types...");
        List<Type> data = typeService.findAll();
        return ResponseEntity
                .ok()
                .body(data);
    }
}
