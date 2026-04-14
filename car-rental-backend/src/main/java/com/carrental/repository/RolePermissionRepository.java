package com.carrental.repository;

import com.carrental.entity.Role;
import com.carrental.entity.RolePermission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface RolePermissionRepository extends JpaRepository<RolePermission, Long> {
    List<RolePermission> findByRole(Role role);
    Set<String> findPermissionNamesByRole(Role role);
}

