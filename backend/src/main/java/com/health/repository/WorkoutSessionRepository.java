package com.health.repository;

import com.health.entity.WorkoutSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface WorkoutSessionRepository extends JpaRepository<WorkoutSession, Long>, JpaSpecificationExecutor<WorkoutSession> {
}
