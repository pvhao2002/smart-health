package com.health.repository;

import com.health.entity.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface UserProfileRepo extends JpaRepository<UserProfile, Long>, JpaSpecificationExecutor<UserProfile> {
}
