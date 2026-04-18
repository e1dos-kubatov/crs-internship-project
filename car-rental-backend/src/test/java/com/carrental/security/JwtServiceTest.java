package com.carrental.security;

import com.carrental.entity.Role;
import com.carrental.entity.User;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.assertj.core.api.Assertions.assertThat;

class JwtServiceTest {

    @Test
    void generateTokenWorksWithShortRenderSecret() {
        JwtService jwtService = new JwtService();
        ReflectionTestUtils.setField(jwtService, "secretKey", "short-secret");
        ReflectionTestUtils.setField(jwtService, "jwtExpiration", 86400000L);

        User user = User.builder()
                .email("admin@example.com")
                .name("Admin")
                .role(Role.ROLE_ADMIN)
                .build();

        String token = jwtService.generateToken(new CustomUserDetails(user));

        assertThat(token).isNotBlank();
        assertThat(jwtService.extractUsername(token)).isEqualTo("admin@example.com");
    }
}
