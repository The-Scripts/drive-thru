package com.thescripts.drive_thru_java;

    import org.springframework.context.annotation.Bean;
    import org.springframework.context.annotation.Configuration;
    import org.springframework.security.config.annotation.web.builders.HttpSecurity;
    import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
    import org.springframework.security.web.SecurityFilterChain;
    import org.springframework.web.cors.CorsConfigurationSource;

    import static org.springframework.security.config.Customizer.withDefaults;

    @Configuration
    public class SecurityConfig {

        private final CorsConfigurationSource corsConfigurationSource;

        public SecurityConfig(CorsConfigurationSource corsConfigurationSource) {
            this.corsConfigurationSource = corsConfigurationSource;
        }

        @Bean
        public SecurityFilterChain defaultSecurityFilterChain(HttpSecurity http) throws Exception {
            http.csrf(AbstractHttpConfigurer::disable)
                    .cors(httpSecurityCorsConfigurer -> httpSecurityCorsConfigurer.configurationSource(corsConfigurationSource))
                    .authorizeHttpRequests((requests) -> requests
                            .requestMatchers("/api/**").permitAll()
                    );
            http.formLogin(withDefaults());
            http.httpBasic(withDefaults());
            return http.build();
        }
    }