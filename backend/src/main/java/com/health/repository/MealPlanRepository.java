package com.health.repository;

import com.health.entity.Goal;
import com.health.entity.MealPlan;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.DayOfWeek;
import java.util.List;

public interface MealPlanRepository extends JpaRepository<MealPlan, Long> {
    List<MealPlan> findAllByGoalAndIsActiveTrueOrderByDayOfWeek(Goal goal);

    @EntityGraph(attributePaths = {"breakfast", "lunch", "dinner", "snack"})
    List<MealPlan> findAllByIsActiveTrue();
}
