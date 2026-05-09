package chucnguyen.bookstore.repository;

import chucnguyen.bookstore.entity.User;
import chucnguyen.bookstore.entity.enums.AuthProvider;
import chucnguyen.bookstore.entity.enums.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    // Tìm user theo email
    Optional<User> findByEmail(String email);

    // Check email đã tồn tại chưa
    boolean existsByEmail(String email);

    @Query("SELECT u FROM User u JOIN u.authProviders ap WHERE u.email = :email AND ap = :authProvider")
    Optional<User> findByEmailAndAuthProvider(
            @Param("email") String email,
            @Param("authProvider") AuthProvider authProvider
    );

    // Tìm user theo provider ID (OAuth2)
    Optional<User> findByProviderId(String providerId);

    // Tìm tất cả user active
    List<User> findByIsActiveTrue();

    // Tìm user theo role
    List<User> findByRole(Role role);

    // Search user theo tên hoặc email
    @Query("SELECT u FROM User u WHERE " +
            "LOWER(u.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<User> searchUsers(@Param("keyword") String keyword, Pageable pageable);

    // Đếm số user theo role
    long countByRole(Role role);

    // Đếm user đăng ký trong khoảng thời gian
    @Query("SELECT COUNT(u) FROM User u WHERE u.createdAt BETWEEN :startDate AND :endDate")
    long countNewUsers(@Param("startDate") LocalDateTime startDate,
                       @Param("endDate") LocalDateTime endDate);
}