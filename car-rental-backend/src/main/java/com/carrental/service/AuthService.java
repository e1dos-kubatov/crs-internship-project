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
import com.carrental.repository.UserRepository;
import com.carrental.security.CustomUserDetails;
import com.carrental.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

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
                .role(Role.ROLE_CUSTOMER)
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
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // 🔥 HYBRID AUTH FIX:
        // We only block them if they are an OAuth user AND they don't have a password.
        if (user.getProvider() != Provider.LOCAL && (user.getPassword() == null || user.getPassword().isEmpty())) {
            throw new BadRequestException("This account uses OAuth2 login and has no local password set.");
        }

        // 🔐 If they are LOCAL or HYBRID (have a password), verify the credentials
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        normalizedEmail,
                        request.getPassword()
                )
        );

        if (Boolean.TRUE.equals(request.getPartnerAccess()) &&
                user.getRole() == Role.ROLE_CUSTOMER) {
            user.setRole(Role.ROLE_PARTNER);
            userRepository.save(user);
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
}