package chucnguyen.bookstore.configuration;

import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.jsontype.impl.LaissezFaireSubTypeValidator;
import io.lettuce.core.ClientOptions;
import io.lettuce.core.SocketOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceClientConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.time.Duration;

@Configuration
@EnableCaching
public class RedisConfig {

        @Value("${spring.data.redis.host:localhost}")
        private String host;

        @Value("${spring.data.redis.port:6379}")
        private int port;

        @Value("${spring.data.redis.password:}")
        private String password;

        @Value("${spring.data.redis.ssl.enabled:false}")
        private boolean useSsl;

        @Bean
        public LettuceConnectionFactory redisConnectionFactory() {
                RedisStandaloneConfiguration config = new RedisStandaloneConfiguration();
                config.setHostName(host);
                config.setPort(port);

                if (password != null && !password.isEmpty()) {
                        config.setPassword(password);
                }

                LettuceClientConfiguration.LettuceClientConfigurationBuilder clientConfigBuilder = LettuceClientConfiguration
                                .builder()
                                .commandTimeout(Duration.ofSeconds(60));

                if (useSsl) {
                        clientConfigBuilder.useSsl().disablePeerVerification();
                }

                ClientOptions clientOptions = ClientOptions.builder()
                                .socketOptions(SocketOptions.builder()
                                                .connectTimeout(Duration.ofSeconds(10))
                                                .keepAlive(true)
                                                .build())
                                .build();

                clientConfigBuilder.clientOptions(clientOptions);

                return new LettuceConnectionFactory(config, clientConfigBuilder.build());
        }

        @Bean
        public RedisTemplate<String, Object> redisTemplate(
                        RedisConnectionFactory connectionFactory,
                        ObjectMapper objectMapper) {

                RedisTemplate<String, Object> template = new RedisTemplate<>();
                template.setConnectionFactory(connectionFactory);

                template.setKeySerializer(new StringRedisSerializer());
                template.setHashKeySerializer(new StringRedisSerializer());

                GenericJackson2JsonRedisSerializer serializer = redisSerializer(objectMapper);
                template.setValueSerializer(serializer);
                template.setHashValueSerializer(serializer);

                template.afterPropertiesSet();
                return template;
        }

        @Bean
        public CacheManager cacheManager(
                        RedisConnectionFactory connectionFactory,
                        ObjectMapper objectMapper) {

                GenericJackson2JsonRedisSerializer serializer = redisSerializer(objectMapper);

                RedisCacheConfiguration config = RedisCacheConfiguration.defaultCacheConfig()
                                .entryTtl(Duration.ofMinutes(10))
                                .serializeKeysWith(
                                                RedisSerializationContext.SerializationPair
                                                                .fromSerializer(new StringRedisSerializer()))
                                .serializeValuesWith(
                                                RedisSerializationContext.SerializationPair
                                                                .fromSerializer(serializer))
                                .disableCachingNullValues();

                return RedisCacheManager.builder(connectionFactory)
                                .cacheDefaults(config)
                                .build();
        }

        private GenericJackson2JsonRedisSerializer redisSerializer(ObjectMapper objectMapper) {
                ObjectMapper redisMapper = objectMapper.copy();
                redisMapper.activateDefaultTyping(
                                LaissezFaireSubTypeValidator.instance,
                                ObjectMapper.DefaultTyping.NON_FINAL,
                                JsonTypeInfo.As.PROPERTY);
                return new GenericJackson2JsonRedisSerializer(redisMapper);
        }
}