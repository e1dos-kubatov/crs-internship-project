package com.carrental.config;

import com.carrental.entity.Provider;
import com.carrental.entity.Role;
import com.carrental.entity.User;
import com.carrental.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
@Slf4j
public class AdminSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JdbcTemplate jdbcTemplate;

    @Value("${app.admin.name}")
    private String adminName;

    @Value("${app.admin.email}")
    private String adminEmail;

    @Value("${app.admin.password}")
    private String adminPassword;

    @Override
    @Transactional
    public void run(String... args) {
        jdbcTemplate.update("update users set role = 'ROLE_PARTNER' where role = 'ROLE_CUSTOMER'");
        jdbcTemplate.update("update cars set transmission = 'auto' where transmission is null");
        jdbcTemplate.update("update cars set fuel = 'gas' where fuel is null");

        if (!hasText(adminEmail) || !hasText(adminPassword)) {
            log.warn("Admin user seed skipped. Set APP_ADMIN_EMAIL and APP_ADMIN_PASSWORD to create the initial admin account.");
            return;
        }

        String normalizedEmail = adminEmail.trim().toLowerCase();
        String normalizedName = hasText(adminName) ? adminName.trim() : "System Admin";

        User admin = userRepository.findByEmail(normalizedEmail)
                .orElseGet(() -> userRepository.save(User.builder()
                        .name(normalizedName)
                        .email(normalizedEmail)
                        .password(passwordEncoder.encode(adminPassword))
                        .role(Role.ROLE_ADMIN)
                        .provider(Provider.LOCAL)
                        .enabled(true)
                        .build()));

        boolean changed = false;

        if (!normalizedName.equals(admin.getName())) {
            admin.setName(normalizedName);
            changed = true;
        }

        if (!isAdminRole(admin.getRole())) {
            admin.setRole(Role.ROLE_ADMIN);
            changed = true;
        }

        if (admin.getProvider() == null) {
            admin.setProvider(Provider.LOCAL);
            changed = true;
        }

        if (!admin.isEnabled()) {
            admin.setEnabled(true);
            changed = true;
        }

        if (admin.isDeleted()) {
            admin.setDeleted(false);
            changed = true;
        }

        if (admin.isBanned()) {
            admin.setBanned(false);
            admin.setBannedReason(null);
            changed = true;
        }

        if (!passwordMatches(adminPassword, admin.getPassword())) {
            admin.setPassword(passwordEncoder.encode(adminPassword));
            changed = true;
        }

        if (changed) {
            userRepository.save(admin);
            log.info("Admin user seed updated account {}", normalizedEmail);
        } else {
            log.info("Admin user seed verified account {}", normalizedEmail);
        }
    }

    private boolean hasText(String value) {
        return value != null && !value.isBlank();
    }

    private boolean isAdminRole(Role role) {
        return role == Role.ROLE_ADMIN || role == Role.ROLE_SUPERADMIN;
    }

    private boolean passwordMatches(String rawPassword, String encodedPassword) {
        if (!hasText(encodedPassword)) {
            return false;
        }

        try {
            return passwordEncoder.matches(rawPassword, encodedPassword);
        } catch (IllegalArgumentException ex) {
            return false;
        }
    }
}
