package pet.care.petcare.config;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {


        return  httpSecurity
                .csrf(csrf -> csrf.disable() ) //
                .authorizeHttpRequests(http -> {
                    http.requestMatchers("/").permitAll();
                    http.requestMatchers("/public/**").permitAll();
                    http.requestMatchers("/uploads/**").permitAll();
                    http.requestMatchers("/rest/**").permitAll();
                    http.requestMatchers("/css/**", "/js/**", "/img/**").permitAll();
                    http.requestMatchers("/client-panel/**").hasAuthority("CLIENT");
                    http.requestMatchers("/staff-panel/**").hasAuthority("CLINIC_STAFF");
                    http.requestMatchers("/admin-panel/**").hasAuthority("ADMIN").anyRequest().authenticated();
                })
                .formLogin(httpSecurityFormLoginConfigurer -> {
                    httpSecurityFormLoginConfigurer.loginPage("/public/login")
                            .successHandler((request, response, authentication) -> {
                                if (authentication.getAuthorities().stream().anyMatch(grantedAuthority ->
                                        grantedAuthority.getAuthority().equals("ADMIN"))) {
                                    response.sendRedirect("/admin-panel");
                                } else if (authentication.getAuthorities().stream().anyMatch(grantedAuthority ->
                                        grantedAuthority.getAuthority().equals("CLIENT"))) {
                                    response.sendRedirect("/client-panel");
                                } else if (authentication.getAuthorities().stream().anyMatch(grantedAuthority ->
                                        grantedAuthority.getAuthority().equals("CLINIC_STAFF"))) {
                                    response.sendRedirect("/staff-panel");
                                }
                            });
                })
                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .logoutSuccessUrl("/")
                        .invalidateHttpSession(true)
                        .deleteCookies("JSESSIONID")
                        .clearAuthentication(true)
                        .permitAll()
                )
                .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

}
