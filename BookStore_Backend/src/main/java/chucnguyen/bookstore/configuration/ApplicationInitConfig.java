//package chucnguyen.bookstore.configuration;
//
//import chucnguyen.bookstore.entity.User;
//import chucnguyen.bookstore.entity.UserPoints;
//import chucnguyen.bookstore.entity.enums.AuthProvider;
//import chucnguyen.bookstore.entity.enums.Role;
//import chucnguyen.bookstore.entity.enums.Tier;
//import chucnguyen.bookstore.repository.UserPointsRepository;
//import chucnguyen.bookstore.repository.UserRepository;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.boot.ApplicationRunner;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.crypto.password.PasswordEncoder;
//
//@Configuration
//@RequiredArgsConstructor
//@Slf4j
//public class ApplicationInitConfig {
//
//    private final PasswordEncoder passwordEncoder;
//
//    @Bean
//    ApplicationRunner applicationRunner(
//            UserRepository userRepository,
//            UserPointsRepository userPointsRepository) {
//        return args -> {
//
//            // ===== Create default admin =====
//            if (!userRepository.existsByEmail("admin@gmail.com")) {
//                log.info("Creating default admin account...");
//
//                User admin = User.builder()
//                        .email("admin@gmail.com")
//                        .password(passwordEncoder.encode("admin123"))
//                        .fullName("System Administrator")
//                        .role(Role.ADMIN)
//                        .authProvider(AuthProvider.LOCAL)
//                        .isActive(true)
//                        .emailVerified(true)
//                        .build();
//
//                admin = userRepository.save(admin);
//
//                UserPoints adminPoints = UserPoints.builder()
//                        .user(admin)
//                        .totalPoints(0)
//                        .lifetimePoints(0)
//                        .tier(Tier.PLATINUM)
//                        .build();
//
//                userPointsRepository.save(adminPoints);
//
//                log.info("Default admin account created!");
//            }
//
//            // ===== Create default user =====
//            if (!userRepository.existsByEmail("user@gmail.com")) {
//                log.info("Creating default user account...");
//
//                User user = User.builder()
//                        .email("user@gmail.com")
//                        .password(passwordEncoder.encode("user123"))
//                        .fullName("Default User")
//                        .role(Role.USER)
//                        .authProvider(AuthProvider.LOCAL)
//                        .isActive(true)
//                        .emailVerified(true)
//                        .build();
//
//                user = userRepository.save(user);
//
//                UserPoints userPoints = UserPoints.builder()
//                        .user(user)
//                        .totalPoints(0)
//                        .lifetimePoints(0)
//                        .tier(Tier.BRONZE)
//                        .build();
//
//                userPointsRepository.save(userPoints);
//
//                log.info("Default user account created!");
//                log.info("Email: user@gmail.com");
//                log.info("Password: user123");
//            }
//
//            log.info("Application initialization completed!");
//        };
//    }
//
//}
