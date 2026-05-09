package chucnguyen.bookstore.configuration;

import chucnguyen.bookstore.exception.AppException;
import chucnguyen.bookstore.exception.ErrorCode;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

import java.time.Duration;

/**
 * Interceptor that enforces Redis-based rate limiting using the @RateLimit annotation.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class RateLimitInterceptor implements HandlerInterceptor {

    private final RedisTemplate<String, Object> redisTemplate;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        if (!(handler instanceof HandlerMethod handlerMethod)) {
            return true;
        }

        RateLimit rateLimit = handlerMethod.getMethodAnnotation(RateLimit.class);
        if (rateLimit == null) {
            return true;
        }

        String clientIp = getClientIp(request);
        String keyPrefix = rateLimit.key().isEmpty() ? request.getRequestURI() : rateLimit.key();
        String redisKey = "rate_limit:" + keyPrefix + ":" + clientIp;

        try {
            Long currentCount = redisTemplate.opsForValue().increment(redisKey);

            if (currentCount != null && currentCount == 1) {
                // First request - set expiry
                redisTemplate.expire(redisKey, Duration.ofSeconds(rateLimit.windowSeconds()));
            }

            if (currentCount != null && currentCount > rateLimit.maxRequests()) {
                Long ttl = redisTemplate.getExpire(redisKey);
                log.warn("Rate limit exceeded for IP: {} on endpoint: {} ({}/{}). Retry after: {}s",
                        clientIp, request.getRequestURI(), currentCount, rateLimit.maxRequests(), ttl);

                response.setHeader("X-RateLimit-Limit", String.valueOf(rateLimit.maxRequests()));
                response.setHeader("X-RateLimit-Remaining", "0");
                response.setHeader("X-RateLimit-Reset", String.valueOf(ttl != null ? ttl : rateLimit.windowSeconds()));
                response.setHeader("Retry-After", String.valueOf(ttl != null ? ttl : rateLimit.windowSeconds()));

                throw new AppException(ErrorCode.RATE_LIMIT_EXCEEDED);
            }

            // Set rate limit headers
            long remaining = rateLimit.maxRequests() - (currentCount != null ? currentCount : 0);
            response.setHeader("X-RateLimit-Limit", String.valueOf(rateLimit.maxRequests()));
            response.setHeader("X-RateLimit-Remaining", String.valueOf(Math.max(0, remaining)));

        } catch (AppException e) {
            throw e;
        } catch (Exception e) {
            // Redis failure should not block requests - fail open
            log.error("Rate limiting Redis error, allowing request: {}", e.getMessage());
        }

        return true;
    }

    private String getClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }

        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }

        return request.getRemoteAddr();
    }
}
