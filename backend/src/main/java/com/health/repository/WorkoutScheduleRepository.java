package com.health.repository;

import com.health.entity.Goal;
import com.health.entity.WorkoutSchedule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.DayOfWeek;
import java.util.List;

public interface WorkoutScheduleRepository extends JpaRepository<WorkoutSchedule, Long> {
    List<WorkoutSchedule> findAllByGoalAndIsActiveTrueOrderByDayOfWeek(Goal goal);

    List<WorkoutSchedule> findAllByIsActiveTrue();
}
