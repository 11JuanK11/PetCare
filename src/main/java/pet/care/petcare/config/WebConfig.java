package pet.care.petcare.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer{
    
    public void addResourceHandler(ResourceHandlerRegistry registry){
        registry.addResourceHandler("/uploads/**")
        .addResourceLocations("file:uploads/");
    }
}
