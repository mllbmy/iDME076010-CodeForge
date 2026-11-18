package org.example.FutureService.config;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class IdmeConfig {

    @Value("${delegate.subAppId}")
    private String subAppId;

    @Value("${delegate.domain}")
    private String domain;

    @PostConstruct
    public void init() {
        System.out.println("iDME SDK 初始化完成 - subAppId: " + subAppId + ", domain: " + domain);
    }
}
