package com.health.repository;

import com.health.entity.WorkoutType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface WorkoutTypeRepository extends JpaRepository<WorkoutType, Long>, JpaSpecificationExecutor<WorkoutType> {
}
