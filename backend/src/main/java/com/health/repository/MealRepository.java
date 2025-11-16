package com.health.repository;

import com.health.entity.Goal;
import com.health.entity.Meal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface MealRepository extends JpaRepository<Meal, Long>, JpaSpecificationExecutor<Meal> {
    List<Meal> findByIsActiveTrue();

    List<Meal> findAllByGoalAndIsActiveTrue(Goal goal);
}
