package org.example.FutureService.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;

@Configuration
public class SwaggerConfig implements WebMvcConfigurer {

    @Value("${server.port:8080}")
    private String serverPort;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns("*")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("FutureService API 文档")
                        .description("""
                                **工业数据管理系统 (基于华为 iDME 平台)**
                                
                                ## 概述
                                FutureService 是一个基于 Spring Boot 3.0 和华为 iDME SDK 构建的工业数据管理后端服务。
                                
                                ## 业务模块
                                - **Equipment（设备管理）**: 设备的增删改查、批量操作
                                - **Part（零部件管理）**: 零部件的主数据管理模式
                                - **WorkingPlan（工作计划）**: 工作计划的创建与跟踪
                                - **WorkingProcedure（工序管理）**: 工序定义与关联管理
                                - **Bom_relation（BOM关系）**: 产品结构关系管理
                                
                                ## 技术栈
                                - Java 17 + Spring Boot 3.0.2
                                - 华为 iDME SDK 3.26.x
                                - MySQL 数据库
                                
                                ## 注意事项
                                - 所有接口使用 POST 方法（iDME 平台规范）
                                - 上下文路径: /api
                                - 响应格式: JSON (统一 Result 包装)
                                """)
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("FutureService Team")
                                .email("support@futureservice.com"))
                        .license(new License()
                                .name("Apache 2.0")
                                .url("https://www.apache.org/licenses/LICENSE-2.0")))
                .servers(List.of(
                        new Server()
                                .url("http://localhost:" + serverPort + "/api")
                                .description("本地开发环境"),
                        new Server()
                                .url("http://production-server:8080/api")
                                .description("生产环境")
                ));
    }
}