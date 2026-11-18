package org.example.FutureService.config;

import com.fasterxml.jackson.databind.Module;
import com.fasterxml.jackson.databind.module.SimpleModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JacksonEnumConfig {

    @Bean
    public Module genericEnumModule() {
        SimpleModule module = new SimpleModule();
        // 为所有 Enum 类型注册自定义反序列化器
        module.addDeserializer(Enum.class, new GenericEnumDeserializer());
        return module;
    }
}