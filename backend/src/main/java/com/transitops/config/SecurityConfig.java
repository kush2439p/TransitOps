package com.transitops.config;

import com.transitops.dto.ApiError;
import com.transitops.security.JwtAuthFilter;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    @Value("${transitops.cors.origins}")
    private String corsOrigins;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration cfg) throws Exception {
        return cfg.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration cfg = new CorsConfiguration();
        List<String> origins = Arrays.stream(corsOrigins.split(","))
                .map(String::trim)
                .map(s -> s.replaceAll("^\"|\"$", ""))
                .filter(s -> !s.isEmpty())
                .toList();
        System.out.println("[TransitOps] CORS allowed origin patterns: " + origins + " (plus wildcard *)");
        // Allow the configured origins AND wildcard — the platform ingress may rewrite Origin.
        cfg.setAllowedOriginPatterns(List.of("*"));
        cfg.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"));
        cfg.setAllowedHeaders(List.of("*"));
        cfg.setExposedHeaders(List.of("Authorization"));
        cfg.setAllowCredentials(true);
        cfg.setMaxAge(3600L);
        var src = new UrlBasedCorsConfigurationSource();
        src.registerCorsConfiguration("/**", cfg);
        return src;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, ObjectMapper mapper) throws Exception {
        http
            .cors(c -> c.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/api/auth/signup",
                    "/api/auth/login",
                    "/api/health",
                    "/error"
                ).permitAll()
                .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll()
                .anyRequest().authenticated()
            )
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint((req, res, e) -> writeJsonError(res, mapper, HttpStatus.UNAUTHORIZED,
                        "Authentication required", req.getRequestURI()))
                .accessDeniedHandler((req, res, e) -> writeJsonError(res, mapper, HttpStatus.FORBIDDEN,
                        "Access denied", req.getRequestURI()))
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    private void writeJsonError(jakarta.servlet.http.HttpServletResponse res, ObjectMapper mapper,
                                HttpStatus s, String msg, String path) throws java.io.IOException {
        res.setStatus(s.value());
        res.setContentType("application/json");
        mapper.writeValue(res.getWriter(), ApiError.builder()
                .status(s.value())
                .error(s.getReasonPhrase())
                .message(msg)
                .path(path)
                .build());
    }
}
