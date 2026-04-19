package com.carrental.service;

import com.carrental.dto.JwtResponse;
import com.carrental.dto.UserLoginRequest;
import com.carrental.entity.Provider;
import com.carrental.entity.Role;
import com.carrental.entity.User;
import com.carrental.exception.BadRequestException;
import com.carrental.exception.UnauthorizedException;
import com.carrental.repository.UserRepository;
import com.carrental.security.CustomUserDetails;
import com.carrental.security.JwtService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthService authService;

    @Test
    void loginRejectsUnknownUserWithUnauthorized() {
        when(userRepository.findByEmail("missing@example.com")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.login(loginRequest("missing@example.com", "Admin123!")))
                .isInstanceOf(UnauthorizedException.class)
                .hasMessage("Invalid email or password");
    }

    @Test
    void loginRejectsLocalUserWithoutPasswordWithUnauthorized() {
        User user = localUser(null);
        when(userRepository.findByEmail("admin@example.com")).thenReturn(Optional.of(user));

        assertThatThrownBy(() -> authService.login(loginRequest("admin@example.com", "Admin123!")))
                .isInstanceOf(UnauthorizedException.class)
                .hasMessage("Invalid email or password");
    }

    @Test
    void loginRejectsOAuthUserWithoutLocalPasswordWithBadRequest() {
        User user = User.builder()
                .email("admin@example.com")
                .name("Admin")
                .role(Role.ROLE_ADMIN)
                .provider(Provider.GOOGLE)
                .build();
        when(userRepository.findByEmail("admin@example.com")).thenReturn(Optional.of(user));

        assertThatThrownBy(() -> authService.login(loginRequest("admin@example.com", "Admin123!")))
                .isInstanceOf(BadRequestException.class)
                .hasMessage("This account uses OAuth2 login and has no local password set. Please use OAuth2 login.");
    }

    @Test
    void loginRejectsWrongPasswordWithUnauthorized() {
        User user = localUser("$2a$10$hash");
        when(userRepository.findByEmail("admin@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrong", "$2a$10$hash")).thenReturn(false);

        assertThatThrownBy(() -> authService.login(loginRequest("admin@example.com", "wrong")))
                .isInstanceOf(UnauthorizedException.class)
                .hasMessage("Invalid email or password");
    }

    @Test
    void loginReturnsJwtForValidLocalCredentials() {
        User user = localUser("$2a$10$hash");
        when(userRepository.findByEmail("admin@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("Admin123!", "$2a$10$hash")).thenReturn(true);
        when(jwtService.generateToken(any(CustomUserDetails.class))).thenReturn("jwt-token");

        JwtResponse response = authService.login(loginRequest("Admin@Example.com", "Admin123!"));

        assertThat(response.getToken()).isEqualTo("jwt-token");
    }

    private UserLoginRequest loginRequest(String email, String password) {
        return UserLoginRequest.builder()
                .email(email)
                .password(password)
                .build();
    }

    private User localUser(String password) {
        return User.builder()
                .email("admin@example.com")
                .name("Admin")
                .password(password)
                .role(Role.ROLE_ADMIN)
                .provider(Provider.LOCAL)
                .enabled(true)
                .build();
    }
}
