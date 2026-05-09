package chucnguyen.bookstore.entity;

import chucnguyen.bookstore.entity.enums.AuthProvider;
import chucnguyen.bookstore.entity.enums.Role;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users", indexes = {
        @Index(name = "idx_users_email", columnList = "email"),
        @Index(name = "idx_users_role", columnList = "role")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false, unique = true)
    private String email;

    private String password;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    private String phone;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role = Role.USER;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "user_auth_providers",
            joinColumns = @JoinColumn(name = "user_id")
    )
    @Column(name = "auth_providers")
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Set<AuthProvider> authProviders = new HashSet<>();

    @Column(name = "provider_id")
    private String providerId;

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "email_verified")
    @Builder.Default
    private Boolean emailVerified = false;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public void addAuthProvider(AuthProvider provider) {
        if (this.authProviders == null) {
            this.authProviders = new HashSet<>();
        }
        this.authProviders.add(provider);
    }

    public void removeAuthProvider(AuthProvider provider) {
        if (this.authProviders != null) {
            this.authProviders.remove(provider);
        }
    }

    public boolean hasAuthProvider(AuthProvider provider) {
        return this.authProviders != null && this.authProviders.contains(provider);
    }

    public boolean canLoginWithLocal() {
        return hasAuthProvider(AuthProvider.LOCAL) &&
                password != null &&
                !password.isEmpty();
    }

    public boolean canLoginWithGoogle() {
        return hasAuthProvider(AuthProvider.GOOGLE) &&
                providerId != null &&
                !providerId.isEmpty();
    }

    public AuthProvider getPrimaryAuthProvider() {
        if (authProviders == null || authProviders.isEmpty()) {
            return AuthProvider.LOCAL;
        }
        if (authProviders.contains(AuthProvider.LOCAL)) {
            return AuthProvider.LOCAL;
        }
        return authProviders.iterator().next();
    }
}