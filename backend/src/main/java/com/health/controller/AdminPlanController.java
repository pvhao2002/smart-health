package com.health.controller;

import com.health.dto.admin.MealDTO;
import com.health.dto.admin.MealPlanDTO;
import com.health.dto.admin.WorkoutScheduleDTO;
import com.health.dto.admin.WorkoutTypeDTO;
import com.health.dto.common.ApiResponse;
import com.health.entity.MealPlan;
import com.health.entity.WorkoutSchedule;
import com.health.entity.WorkoutType;
import com.health.repository.MealPlanRepository;
import com.health.repository.WorkoutScheduleRepository;
import com.health.repository.WorkoutTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/admin/plans")
@RequiredArgsConstructor
public class AdminPlanController {
    private final MealPlanRepository mealPlanRepository;
    private final WorkoutScheduleRepository workoutScheduleRepository;
    private final WorkoutTypeRepository workoutTypeRepository;

    // --- Meal Plans ---
    @GetMapping("/meals")
    @Transactional(readOnly = true)
    public Object getMealPlans() {
        return mealPlanRepository.findAllByIsActiveTrue().stream()
                .map(p -> MealPlanDTO.builder()
                        .id(p.getId())
                        .name(p.getName())
                        .goal(p.getGoal().name())
                        .dayOfWeek(p.getDayOfWeek().name())
                        .breakfast(p.getBreakfast() != null ? new MealDTO(p.getBreakfast()) : null)
                        .lunch(p.getLunch() != null ? new MealDTO(p.getLunch()) : null)
                        .dinner(p.getDinner() != null ? new MealDTO(p.getDinner()) : null)
                        .snack(p.getSnack() != null ? new MealDTO(p.getSnack()) : null)
                        .totalCalories(p.getTotalCalories())
                        .totalProtein(p.getTotalProtein())
                        .totalCarbs(p.getTotalCarbs())
                        .totalFat(p.getTotalFat())
                        .build())
                .toList();
    }

    @PostMapping("/meals")
    @Transactional
    public Object addMealPlan(@RequestBody MealPlan plan) {
        mealPlanRepository.save(plan);
        return ApiResponse.success("Meal plan added successfully");
    }

    @PatchMapping("/meals/{id}")
    @Transactional
    public Object updateMealPlan(@PathVariable Long id, @RequestBody MealPlan plan) {
        MealPlan existing = mealPlanRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Meal plan not found"));

        // ✅ Chỉ set nếu có dữ liệu gửi lên
        if (plan.getName() != null && !plan.getName().isBlank()) {
            existing.setName(plan.getName());
        }
        if (plan.getGoal() != null) {
            existing.setGoal(plan.getGoal());
        }
        if (plan.getDayOfWeek() != null) {
            existing.setDayOfWeek(plan.getDayOfWeek());
        }
        if (plan.getBreakfast() != null) {
            existing.setBreakfast(plan.getBreakfast());
        }
        if (plan.getLunch() != null) {
            existing.setLunch(plan.getLunch());
        }
        if (plan.getDinner() != null) {
            existing.setDinner(plan.getDinner());
        }
        if (plan.getSnack() != null) {
            existing.setSnack(plan.getSnack());
        }
        if (plan.getIsActive() != null) {
            existing.setIsActive(plan.getIsActive());
        }

        // ✅ Recalculate totals only if meals changed
        existing.calculateTotals();

        mealPlanRepository.save(existing);
        return ApiResponse.success("Meal plan updated successfully");
    }

    @DeleteMapping("/meals/{id}")
    @Transactional
    public void deleteMealPlan(@PathVariable Long id) {
        mealPlanRepository.deleteById(id);
    }

    // --- Workout Schedules ---
    @GetMapping("/workouts")
    @Transactional(readOnly = true)
    public Object getWorkoutSchedules() {
        return workoutScheduleRepository.findAllByIsActiveTrue()
                .stream()
                .map(s -> WorkoutScheduleDTO.builder()
                        .id(s.getId())
                        .name(s.getName())
                        .dayOfWeek(s.getDayOfWeek())
                        .isRestDay(s.getIsRestDay())
                        .workouts(Optional.ofNullable(s.getWorkout()).map(WorkoutTypeDTO::new).orElse(null))
                        .build())
                .toList();
    }

    @PostMapping("/workouts")
    @Transactional
    public Object addWorkoutSchedule(@RequestBody WorkoutSchedule schedule) {
        workoutScheduleRepository.save(schedule);
        return ApiResponse.success("Workout schedule added successfully");
    }

    @PatchMapping("/workouts/{id}")
    @Transactional
    public Object updateWorkoutSchedule(@PathVariable Long id, @RequestBody WorkoutSchedule schedule) {
        WorkoutSchedule existing = workoutScheduleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Workout schedule not found"));

        if (schedule.getName() != null && !schedule.getName().isBlank()) {
            existing.setName(schedule.getName());
        }
        if (schedule.getGoal() != null) {
            existing.setGoal(schedule.getGoal());
        }
        if (schedule.getDayOfWeek() != null) {
            existing.setDayOfWeek(schedule.getDayOfWeek());
        }
        if (schedule.getIsRestDay() != null) {
            existing.setIsRestDay(schedule.getIsRestDay());
        }
        if (schedule.getIsActive() != null) {
            existing.setIsActive(schedule.getIsActive());
        }

        Optional.ofNullable(schedule.getWorkout())
                .map(WorkoutType::getId)
                .flatMap(workoutTypeRepository::findById)
                .ifPresent(existing::setWorkout);

        workoutScheduleRepository.save(existing);
        return ApiResponse.success("Workout schedule updated successfully");
    }


    @DeleteMapping("/workouts/{id}")
    @Transactional
    public void deleteWorkoutSchedule(@PathVariable Long id) {
        workoutScheduleRepository.deleteById(id);
    }
}
