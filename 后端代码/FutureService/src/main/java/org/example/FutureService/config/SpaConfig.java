package org.example.FutureService.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Configuration
public class SpaConfig implements WebMvcConfigurer {

    private static final List<String> STATIC_EXTENSIONS = Arrays.asList(
            ".js", ".css", ".png", ".jpg", ".jpeg", ".gif", ".svg", ".ico",
            ".woff", ".woff2", ".ttf", ".eot", ".map", ".json"
    );

    private static final List<String> API_ENDPOINTS = Arrays.asList(
            "Equipment/", "Part/", "WorkingPlan/", "WorkingProcedure/",
            "Bom_relation/", "auth/", "test/"
    );

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/")
                .resourceChain(true)
                .addResolver(new SpaPathResourceResolver());
    }

    private static class SpaPathResourceResolver extends PathResourceResolver {

        @Override
        protected Resource getResource(String resourcePath, Resource location) throws IOException {
            Resource resource = location.createRelative(resourcePath);

            if (resource.exists() && resource.isReadable()) {
                return resource;
            }

            if (isStaticAsset(resourcePath)) {
                return null;
            }

            if (isApiEndpoint(resourcePath)) {
                return null;
            }

            return new ClassPathResource("/static/index.html");
        }

        private boolean isStaticAsset(String path) {
            int dotIndex = path.lastIndexOf('.');
            if (dotIndex > 0) {
                String ext = path.substring(dotIndex).toLowerCase();
                return STATIC_EXTENSIONS.contains(ext);
            }
            return false;
        }

        private boolean isApiEndpoint(String path) {
            for (String prefix : API_ENDPOINTS) {
                if (path.startsWith(prefix)) {
                    return true;
                }
            }
            return false;
        }
    }
}
