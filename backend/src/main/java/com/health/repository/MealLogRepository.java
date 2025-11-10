package com.health.repository;

import com.health.entity.MealLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface MealLogRepository extends JpaRepository<MealLog, Long>, JpaSpecificationExecutor<MealLog> {
}
