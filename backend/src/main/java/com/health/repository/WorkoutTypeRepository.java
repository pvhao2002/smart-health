package com.health.repository;

import com.health.entity.WorkoutType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface WorkoutTypeRepository extends JpaRepository<WorkoutType, Long>, JpaSpecificationExecutor<WorkoutType> {
    List<WorkoutType> findAllByIsActiveTrue();
}
