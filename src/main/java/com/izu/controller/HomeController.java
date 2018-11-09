package com.izu.controller;

import com.izu.type.Person;
import com.izu.type.Type;
import com.izu.service.PersonService;
import com.izu.service.TypeService;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;

import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;


@Controller
public class HomeController {

    private static final Log logger = LogFactory.getLog(HomeController.class);

    @Autowired
    private PersonService personService;

    @Autowired
    private TypeService typeService;


    @GetMapping(value = { "/", "/izu" })
    public String home(Model model) {

        List<Type> types = typeService.findAll();
        model.addAttribute("types", types);

        List<Person> persons = personService.findAll();
        model.addAttribute("customers", persons);

        return "main-menu";
    }

}
