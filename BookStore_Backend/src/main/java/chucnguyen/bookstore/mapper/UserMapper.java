package chucnguyen.bookstore.mapper;

import chucnguyen.bookstore.dto.request.RegisterRequest;
import chucnguyen.bookstore.dto.request.UpdateProfileRequest;
import chucnguyen.bookstore.dto.response.UserProfileResponse;
import chucnguyen.bookstore.dto.response.UserResponse;
import chucnguyen.bookstore.entity.User;
import chucnguyen.bookstore.entity.enums.AuthProvider;
import org.mapstruct.*;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "avatarUrl", ignore = true)
    @Mapping(target = "role", constant = "USER")
    @Mapping(target = "authProviders", ignore = true)
    @Mapping(target = "providerId", ignore = true)
    @Mapping(target = "isActive", constant = "true")
    @Mapping(target = "emailVerified", constant = "false")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    User toUser(RegisterRequest request);

    @Mapping(target = "role", expression = "java(user.getRole().name())")
    @Mapping(target = "authProviders", expression = "java(formatAuthProviders(user))")
    UserResponse toUserResponse(User user);

    @Mapping(target = "role", expression = "java(user.getRole().name())")
    @Mapping(target = "authProviders", expression = "java(formatAuthProviders(user))")
    @Mapping(target = "totalPoints", constant = "0")
    @Mapping(target = "lifetimePoints", constant = "0")
    @Mapping(target = "tier", constant = "BRONZE")
    @Mapping(target = "totalOrders", constant = "0L")
    @Mapping(target = "totalReviews", constant = "0L")
    @Mapping(target = "consecutiveCheckInDays", constant = "0")
    UserProfileResponse toUserProfileResponse(User user);

    List<UserResponse> toUserResponseList(List<User> users);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "email", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "role", ignore = true)
    @Mapping(target = "authProviders", ignore = true)
    @Mapping(target = "providerId", ignore = true)
    @Mapping(target = "isActive", ignore = true)
    @Mapping(target = "emailVerified", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateUserFromRequest(UpdateProfileRequest request, @MappingTarget User user);

    /**
     * Format auth providers based on:
     * - Email verified + has password → Show both GOOGLE and LOCAL
     * - Email verified + no password → Show only GOOGLE
     * - Email not verified → Show only actual providers
     */
    default String formatAuthProviders(User user) {
        if (user.getAuthProviders() == null || user.getAuthProviders().isEmpty()) {
            return "LOCAL";
        }

        Set<AuthProvider> providers = user.getAuthProviders();
        boolean hasGoogle = providers.contains(AuthProvider.GOOGLE);
        boolean hasLocal = providers.contains(AuthProvider.LOCAL);
        boolean hasPassword = user.getPassword() != null && !user.getPassword().isEmpty();
        boolean emailVerified = user.getEmailVerified();

        // Logic: Email verified + has password → can login with both methods
        if (emailVerified && hasPassword) {
            if (hasGoogle) {
                // Has Google + password + verified → Show both
                return "GOOGLE, LOCAL";
            } else if (hasLocal) {
                // Has LOCAL only + verified → Just show LOCAL
                return "LOCAL";
            }
        }

        // Default: Show actual providers
        return providers.stream()
                .map(AuthProvider::name)
                .sorted()
                .collect(Collectors.joining(", "));
    }
}