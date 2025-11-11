package com.health.controller;

import com.health.dto.admin.MealDTO;
import com.health.dto.admin.MealPlanDTO;
import com.health.dto.common.ApiResponse;
import com.health.entity.MealPlan;
import com.health.entity.WorkoutSchedule;
import com.health.repository.MealPlanRepository;
import com.health.repository.WorkoutScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/plans")
@RequiredArgsConstructor
public class AdminPlanController {

    private final MealPlanRepository mealPlanRepository;
    private final WorkoutScheduleRepository workoutScheduleRepository;

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
        plan.setId(id);
        mealPlanRepository.save(plan);
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
        return workoutScheduleRepository.findAllByIsActiveTrue();
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
        schedule.setId(id);
        workoutScheduleRepository.save(schedule);
        return ApiResponse.success("Workout schedule updated successfully");
    }

    @DeleteMapping("/workouts/{id}")
    @Transactional
    public void deleteWorkoutSchedule(@PathVariable Long id) {
        workoutScheduleRepository.deleteById(id);
    }
}
