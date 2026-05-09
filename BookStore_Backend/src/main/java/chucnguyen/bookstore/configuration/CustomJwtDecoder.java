package chucnguyen.bookstore.configuration;

import com.nimbusds.jwt.SignedJWT;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.stereotype.Component;

import javax.crypto.spec.SecretKeySpec;
import java.text.ParseException;
import java.util.Objects;

@Component
@RequiredArgsConstructor
@Slf4j
public class CustomJwtDecoder implements JwtDecoder {

    @Value("${jwt.secret}")
    private String signerKey;

    private final JwtUtils jwtUtils;
    private NimbusJwtDecoder nimbusJwtDecoder = null;

    @Override
    public Jwt decode(String token) throws JwtException {
        try {
            // Check if token is blacklisted
            if (jwtUtils.isTokenBlacklisted(token)) {
                log.warn("Attempting to use blacklisted token");
                throw new JwtException("Token has been revoked");
            }

            SignedJWT signedJWT = SignedJWT.parse(token);
            return getNimbusJwtDecoder().decode(token);

        } catch (ParseException e) {
            log.error("Error decoding token", e);
            throw new JwtException("Invalid token");
        }
    }

    private NimbusJwtDecoder getNimbusJwtDecoder() {
        if (Objects.isNull(nimbusJwtDecoder)) {
            SecretKeySpec secretKeySpec = new SecretKeySpec(
                    signerKey.getBytes(),
                    "HS512"
            );
            nimbusJwtDecoder = NimbusJwtDecoder
                    .withSecretKey(secretKeySpec)
                    .macAlgorithm(MacAlgorithm.HS512)
                    .build();
        }

        return nimbusJwtDecoder;
    }
}