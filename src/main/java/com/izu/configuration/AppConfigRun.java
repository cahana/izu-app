package com.izu.configuration;

import javax.annotation.PostConstruct;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.annotation.PropertySources;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.util.Assert;

@Profile(value = { "test", "prod" })
@Configuration
@ComponentScan(basePackages = "com.izu")
@EntityScan(basePackages = { "com.izu.type" })
@EnableJpaRepositories(basePackages = { "com.izu.repository" })
@PropertySources({
        @PropertySource("classpath:custom.properties"),
        @PropertySource(value = "file:${user.home}/.${user.name}-conf/izu-overrides.properties",
                ignoreResourceNotFound = true)
})
public class AppConfigRun {

    private static final Log logger = LogFactory.getLog(AppConfigRun.class);

    @Value("${spring.datasource.initialize}")
    private boolean springDatasourceInitialize;

    @PostConstruct
    public void init() {
        logger.info("AppConfigRun init");

        Assert.isTrue(springDatasourceInitialize == false,
                "Property 'spring.datasource.initialize' should be false.");
    }

}
