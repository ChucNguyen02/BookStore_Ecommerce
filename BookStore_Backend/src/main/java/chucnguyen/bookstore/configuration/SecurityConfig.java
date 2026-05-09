package chucnguyen.bookstore.configuration;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final CustomJwtDecoder customJwtDecoder;
    private final CustomUserDetailsService customUserDetailsService;

    @Value("${cors.allowed-origins}")
    private String[] allowedOrigins;

    private static final String[] FULLY_PUBLIC_ENDPOINTS = {
            "/swagger-ui/**",
            "/v3/api-docs/**",
            "/api-docs/**",
            "/actuator/health",

            // Auth endpoints
            "/auth/register",
            "/auth/google",
            "/auth/login",
            "/auth/logout",
            "/auth/forgot-password",
            "/auth/reset-password",
            "/auth/validate-reset-token",

            // Email verification endpoints
            "/users/verify-email",
            "/users/validate-verification-token",
            "/users/resend-verification-email",

            // Payment gateway callbacks
            "/payment/vnpay/return",
            "/payment/momo/return",
            "/payment/momo/notify",

            // PayOS callbacks (called by PayOS server or redirect from browser - no auth)
            "/payment/payos/webhook",
            "/payment/payos/return",
            "/payment/payos/cancel",

            "/orders/public/**"
    };

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http.csrf(AbstractHttpConfigurer::disable);
        http.cors(cors -> cors.configurationSource(corsConfigurationSource()));

        http.authorizeHttpRequests(auth -> auth
                // 1. Hoàn toàn public
                .requestMatchers(FULLY_PUBLIC_ENDPOINTS).permitAll()

                // 2. GET danh sách review sách (public)
                .requestMatchers(HttpMethod.GET, "/reviews/book/**").permitAll()

                // 3. Public browse endpoints (books, categories, authors, etc.)
                .requestMatchers(
                        "/ai/chat",
                        "/ai/recommend",
                        "/ai/summarize-reviews/**",
                        "/books/**",
                        "/categories/**",
                        "/authors/**",
                        "/vouchers/all-available",
                        "/vouchers/{code}",
                        "/vouchers/check-valid/**",
                        "/view-history/record/**"
                ).permitAll()

                // 4. Review related public endpoints
                .requestMatchers(
                        "/reviews/book/*/summary",
                        "/reviews/book/*/top-helpful",
                        "/reviews/*/replies",
                        "/reviews/*/has-seller-reply",
                        "/reviews/*/votes/**",
                        "/reviews/global/**"
                ).permitAll()

                // 5. Questions public endpoints
                .requestMatchers("/questions/book/**").permitAll()

                // 6. Rewards - Public GET endpoints (browse only, no login required)
                .requestMatchers(HttpMethod.GET,
                        "/rewards",
                        "/rewards/*",
                        "/rewards/type/**",
                        "/rewards/in-stock",
                        "/rewards/points-range",
                        "/rewards/top-claimed",
                        "/rewards/*/check-stock",
                        "/rewards/*/redemption-count"
                ).permitAll()

                // 7. Rewards - Authenticated endpoints (actions require login)
                .requestMatchers(
                        "/rewards/redeem",
                        "/rewards/history",
                        "/rewards/history/**",
                        "/rewards/affordable",
                        "/rewards/my-redemptions/**",
                        "/rewards/total-spent",
                        "/rewards/*/has-redeemed",
                        "/rewards/vouchers"
                ).authenticated()

                // 8. Upload file cần login
                .requestMatchers("/upload/**").authenticated()

                // 9. Admin area - CRITICAL: Phải để TRƯỚC /orders/**
                .requestMatchers("/admin/**").hasRole("ADMIN")

                // 10. Quản lý sách, category, author (ADMIN)
                .requestMatchers(HttpMethod.POST, "/books", "/categories", "/authors").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/ai/generate-description").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/books/**", "/categories/**", "/authors/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/books/**", "/categories/**", "/authors/**").hasRole("ADMIN")

                // 11. Admin reply review
                .requestMatchers(HttpMethod.POST, "/reviews/*/reply").hasRole("ADMIN")

                // 12. Admin xem pending reviews
                .requestMatchers(HttpMethod.GET, "/reviews/pending").hasRole("ADMIN")

                // 13. Payment creation endpoints
                .requestMatchers("/payment/vnpay/create", "/payment/momo/create", "/payment/payos/create").authenticated()

                // 14. Orders - Phải để SAU /admin/** và /orders/public/**
                .requestMatchers("/orders/**").authenticated()

                // 15. Các endpoint cần user đã login
                .requestMatchers("/reviews/**").authenticated()

                // 16. Các endpoint user khác
                .requestMatchers(
                        "/cart/**",
                        "/wishlist/**",
                        "/questions/**",
                        "/points/**",
                        "/addresses/**",
                        "/notifications/**",
                        "/view-history/**",
                        "/users/**",
                        "/vouchers"
                ).authenticated()

                // 17. Mọi request còn lại cần authenticated
                .anyRequest().authenticated()
        );

        http.oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt
                        .decoder(customJwtDecoder)
                        .jwtAuthenticationConverter(jwtAuthenticationConverter())
                )
                .authenticationEntryPoint(new JwtAuthenticationEntryPoint())
        );

        http.sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        return http.build();
    }

    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter converter = new JwtGrantedAuthoritiesConverter();
        converter.setAuthoritiesClaimName("scope");
        converter.setAuthorityPrefix("");

        JwtAuthenticationConverter jwtConverter = new JwtAuthenticationConverter();
        jwtConverter.setJwtGrantedAuthoritiesConverter(converter);

        return jwtConverter;
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(Arrays.asList(allowedOrigins));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(Arrays.asList("*"));
        config.setExposedHeaders(Arrays.asList("Authorization"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(customUserDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}