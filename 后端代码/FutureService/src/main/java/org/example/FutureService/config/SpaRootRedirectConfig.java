package org.example.FutureService.config;

import jakarta.servlet.ServletContext;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.boot.web.servlet.ServletContextInitializer;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;

@Configuration
public class SpaRootRedirectConfig implements ServletContextInitializer {

    @Override
    public void onStartup(ServletContext servletContext) throws ServletException {
        HttpServlet redirectServlet = new HttpServlet() {
            @Override
            protected void service(HttpServletRequest req, HttpServletResponse resp) throws IOException {
                // 该 Servlet 只处理上下文根（映射 ""），统一重定向到 SPA 入口
                resp.sendRedirect("/api/index.html");
            }
        };

        jakarta.servlet.ServletRegistration.Dynamic registration =
            servletContext.addServlet("spaRootRedirect", redirectServlet);
        // 仅精确映射到上下文根（""），不能用 "/"，否则会覆盖 DispatcherServlet 的默认映射，
        // 导致所有 /api/** 请求都被重定向、后端接口不可达。
        registration.addMapping("");
    }
}
