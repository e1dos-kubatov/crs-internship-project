package com.carrental.service;

import com.carrental.dto.JwtResponse;
import com.carrental.dto.UserResponseDto;
import com.carrental.dto.UserLoginRequest;
import com.carrental.dto.UserRegisterRequest;
import com.carrental.entity.Provider;
import com.carrental.entity.Role;
import com.carrental.entity.User;
import com.carrental.exception.BadRequestException;
import com.carrental.exception.ResourceNotFoundException;
import com.carrental.exception.UnauthorizedException;
import com.carrental.repository.UserRepository;
import com.carrental.security.CustomUserDetails;
import com.carrental.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Transactional
    public JwtResponse register(UserRegisterRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();

        if (userRepository.findByEmail(normalizedEmail).isPresent()) {
            throw new BadRequestException("Email already exists");
        }

        User user = User.builder()
                .name(request.getName())
                .email(normalizedEmail)
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.ROLE_PARTNER)
                .provider(Provider.LOCAL)
                .build();

        userRepository.save(user);

        return JwtResponse.builder()
                .token(jwtService.generateToken(new CustomUserDetails(user)))
                .build();
    }

    public JwtResponse login(UserLoginRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();

        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(this::invalidCredentials);

        if (user.getProvider() != Provider.LOCAL && (user.getPassword() == null || user.getPassword().isEmpty())) {
            throw new BadRequestException("This account uses OAuth2 login and has no local password set. Please use OAuth2 login.");
        }

        if (!user.isEnabled() || user.isDeleted() || user.isBanned()) {
            throw new UnauthorizedException("Account is disabled or locked");
        }

        if (user.getPassword() == null || user.getPassword().isBlank()
                || !passwordMatches(request.getPassword(), user.getPassword())) {
            throw invalidCredentials();
        }

        return JwtResponse.builder()
                .token(jwtService.generateToken(new CustomUserDetails(user)))
                .build();
    }

    public UserResponseDto getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return UserResponseDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .provider(user.getProvider())
                .build();
    }

    private boolean passwordMatches(String rawPassword, String encodedPassword) {
        try {
            return passwordEncoder.matches(rawPassword, encodedPassword);
        } catch (IllegalArgumentException ex) {
            return false;
        }
    }

    private UnauthorizedException invalidCredentials() {
        return new UnauthorizedException("Invalid email or password");
    }
}
