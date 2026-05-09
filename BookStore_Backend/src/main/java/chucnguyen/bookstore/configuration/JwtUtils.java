package chucnguyen.bookstore.configuration;

import chucnguyen.bookstore.entity.User;
import chucnguyen.bookstore.repository.UserRepository;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Component
@Slf4j
@RequiredArgsConstructor
public class JwtUtils {

    private final UserRepository userRepository;
    private final RedisTemplate<String, Object> redisTemplate;

    @Value("${jwt.secret}")
    private String signerKey;

    @Value("${jwt.expiration}")
    private Long expiration;

    @Value("${jwt.refresh-expiration:604800000}")
    private Long refreshExpiration;

    private static final String BLACKLIST_PREFIX = "blacklist:token:";

    /**
     * Generate JWT token for user
     */
    public String generateToken(String email) {
        try {
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found: " + email));

            return buildToken(user, expiration);

        } catch (Exception e) {
            log.error("Error generating token for user: {}", email, e);
            throw new RuntimeException("Error generating token", e);
        }
    }

    /**
     * Generate refresh token for user
     */
    public String generateRefreshToken(String email) {
        try {
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found: " + email));

            return buildToken(user, refreshExpiration);

        } catch (Exception e) {
            log.error("Error generating refresh token for user: {}", email, e);
            throw new RuntimeException("Error generating refresh token", e);
        }
    }

    /**
     * Build JWT token with user claims
     */
    private String buildToken(User user, Long expirationTime) throws JOSEException {
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);

        Date issueTime = new Date();
        Date expiryTime = new Date(
                Instant.now().plus(expirationTime, ChronoUnit.MILLIS).toEpochMilli()
        );

        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(user.getEmail())
                .issuer("bookstore.com")
                .issueTime(issueTime)
                .expirationTime(expiryTime)
                .jwtID(UUID.randomUUID().toString())
                .claim("scope", buildScope(user))
                .claim("userId", user.getId())
                .claim("role", user.getRole().name())
                .claim("email", user.getEmail())
                .claim("fullName", user.getFullName())
                .build();

        Payload payload = new Payload(jwtClaimsSet.toJSONObject());
        JWSObject jwsObject = new JWSObject(header, payload);
        jwsObject.sign(new MACSigner(signerKey.getBytes()));

        String token = jwsObject.serialize();
        log.debug("Token generated for user: {} with role: {}", user.getEmail(), user.getRole());

        return token;
    }

    /**
     * Build scope string with ROLE_ prefix for Spring Security
     */
    private String buildScope(User user) {
        return "ROLE_" + user.getRole().name();
    }

    /**
     * Blacklist token (for logout)
     */
    public void blacklistToken(String token) {
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            String jti = signedJWT.getJWTClaimsSet().getJWTID();
            Date expiryTime = signedJWT.getJWTClaimsSet().getExpirationTime();

            if (jti != null && expiryTime != null) {
                long ttl = expiryTime.getTime() - System.currentTimeMillis();
                if (ttl > 0) {
                    redisTemplate.opsForValue().set(
                            BLACKLIST_PREFIX + jti,
                            "blacklisted",
                            ttl,
                            TimeUnit.MILLISECONDS
                    );
                    log.info("Token blacklisted: {}", jti);
                }
            }
        } catch (ParseException e) {
            log.error("Error blacklisting token", e);
        }
    }

    /**
     * Check if token is blacklisted
     */
    public boolean isTokenBlacklisted(String token) {
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            String jti = signedJWT.getJWTClaimsSet().getJWTID();

            if (jti != null) {
                Boolean exists = redisTemplate.hasKey(BLACKLIST_PREFIX + jti);
                return Boolean.TRUE.equals(exists);
            }
        } catch (ParseException e) {
            log.error("Error checking token blacklist", e);
        }
        return false;
    }

    /**
     * Extract JWT ID from token
     */
    public String getJwtId(String token) {
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            return signedJWT.getJWTClaimsSet().getJWTID();
        } catch (ParseException e) {
            log.error("Error extracting JWT ID", e);
            return null;
        }
    }

    /**
     * Get token expiration time in seconds
     */
    public Long getExpirationTime() {
        return expiration / 1000;
    }

    /**
     * Get refresh token expiration time in seconds
     */
    public Long getRefreshExpirationTime() {
        return refreshExpiration / 1000;
    }

    /**
     * Validate token structure
     */
    public boolean validateTokenStructure(String token) {
        try {
            String[] parts = token.split("\\.");
            return parts.length == 3;
        } catch (Exception e) {
            log.error("Invalid token structure", e);
            return false;
        }
    }
}