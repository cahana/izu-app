package com.izu.service;

import com.izu.type.Person;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;


@Service
public class EmailService {

    private static final Log logger = LogFactory.getLog(EmailService.class);

    private JavaMailSender javaMailSender;

    @Value("${spring.profiles.active}")
    private String environment;

    @Value("${app.mail.enabled}")
    private boolean isEnabled;

    @Value("${app.mail.from:no-reply}")
    private String from;

    @Value("${app.email.subject}")
    private String emailSubject;

    @Autowired
    private PersonService personService;

    @Autowired
    public EmailService(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    public boolean isEnabled() {
        return isEnabled;
    }

    public void setEnabled(boolean isEnabled) {
        this.isEnabled = isEnabled;
    }

    public void send(Person person) {
        logger.info("Sending email from send(user)...");
        if (isEnabled && person != null) {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setTo(person.getEmail());

            msg.setFrom(from);
            String text = "This is a test from the Izu Body Type Calculator."
                    + "\n\nYour basic User information:\n" + person;
            msg.setText(text);
            msg.setSubject("Testing from Spring Boot");
            try {
                javaMailSender.send(msg);
            } catch (MailException ex) {
                logger.error("Error", ex);
            }
        }
    }
}
