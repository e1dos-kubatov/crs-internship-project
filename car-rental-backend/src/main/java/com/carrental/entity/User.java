package com.carrental.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    private String password;

    // ===== ROLE SYSTEM =====
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Role role = Role.ROLE_PARTNER;

    // ===== PROVIDER =====
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Provider provider = Provider.LOCAL;

    private String providerId;

    // ===== ACCOUNT STATUS =====
    @Column(nullable = false)
    @Builder.Default
    private boolean isDeleted = false;

    @Column(nullable = false)
    @Builder.Default
    private boolean banned = false;

    private String bannedReason;

    // ===== AUDIT / SECURITY (OPTIONAL BUT IMPORTANT) =====
    @Builder.Default
    private boolean enabled = true;
}
