package chucnguyen.bookstore.configuration;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Annotation to apply Redis-based rate limiting on controller methods.
 * Uses client IP address as the key.
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface RateLimit {

    /**
     * Maximum number of requests allowed in the time window.
     */
    int maxRequests() default 60;

    /**
     * Time window in seconds.
     */
    int windowSeconds() default 60;

    /**
     * Key prefix for this rate limit. If empty, uses the request URI.
     */
    String key() default "";
}
