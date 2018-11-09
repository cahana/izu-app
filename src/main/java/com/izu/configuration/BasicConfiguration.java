package com.izu.configuration;

import javax.annotation.PostConstruct;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties("spring.datasource")
public class BasicConfiguration {

    private static final Log logger = LogFactory.getLog(BasicConfiguration.class);

    private String schema;
    private boolean initialize;
    private String url;
    private String driverClassName;

    public void setSchema(String schema) {
        this.schema = schema;
    }

    public void setInitialize(boolean initialize) {
        this.initialize = initialize;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public void setDriverClassName(String driverClassName) {
        this.driverClassName = driverClassName;
    }

    @PostConstruct
    public void init() {
        logger.info("\t schema         : " + schema);
        logger.info("\t initialize     : " + initialize);
        logger.info("\t url            : " + url);
        logger.info("\t driverClassName: " + driverClassName);
    }
}