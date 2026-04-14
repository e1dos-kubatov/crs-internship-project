package com.carrental.service;

import com.carrental.entity.Role;
import com.carrental.entity.RolePermission;
import com.carrental.repository.RolePermissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PermissionService {

    private final RolePermissionRepository rolePermissionRepository;

    public Set<String> getPermissionsForRole(Role role) {
        return rolePermissionRepository.findPermissionNamesByRole(role).stream()
                .map(p -> "PERMISSION_" + p)
                .collect(Collectors.toSet());
    }

    public List<GrantedAuthority> getAuthoritiesForRole(Role role) {
        List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority(role.name()));
        rolePermissionRepository.findByRole(role).forEach(rp -> 
            authorities.add(new SimpleGrantedAuthority("PERMISSION_" + rp.getPermission().name()))
        );
        return authorities;
    }
}

