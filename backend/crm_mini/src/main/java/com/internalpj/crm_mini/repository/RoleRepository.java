package com.internalpj.crm_mini.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.internalpj.crm_mini.entity.Role;

public interface RoleRepository extends JpaRepository<Role, Integer> {
    
}
