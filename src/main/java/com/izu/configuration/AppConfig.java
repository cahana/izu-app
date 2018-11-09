package com.izu.configuration;

import javax.annotation.PostConstruct;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.context.annotation.PropertySource;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.util.Assert;

@Profile(value = { "default", "dev" })
@Configuration
@ComponentScan(basePackages = "com.izu")
@EntityScan(basePackages = { "com.izu.type" })
@EnableJpaRepositories(basePackages = { "com.izu.repository" })
@PropertySource(value = { "classpath:custom.properties" })
public class AppConfig {

    private static final Log logger = LogFactory.getLog(AppConfig.class);

    @Value("${spring.datasource.initialize}")
    private boolean springDatasourceInitialize;

    @PostConstruct
    public void init() {
        logger.info("AppConfig init");
        Assert.isTrue(springDatasourceInitialize,
                "Property 'spring.datasource.initialize' should be true.");
    }

}
