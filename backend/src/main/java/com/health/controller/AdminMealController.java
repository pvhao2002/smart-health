package com.health.controller;

import com.health.entity.Meal;
import com.health.repository.MealRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("admin/meals")
@RequiredArgsConstructor
public class AdminMealController {
    private final MealRepository mealRepository;

    @GetMapping
    @Transactional(readOnly = true)
    public Object getMeal() {
        return mealRepository.findByIsActiveTrue();
    }

    /**
     * Create a new meal
     */
    @PostMapping
    @Transactional
    public Object addMeal(@RequestBody Meal meal) {
        if (meal.getName() == null || meal.getName().isBlank()) {
            return ResponseEntity.badRequest().body("Meal name cannot be empty");
        }
        Meal saved = mealRepository.save(meal);
        return ResponseEntity.ok(saved);
    }

    /**
     * Update existing meal by ID
     */
    @PatchMapping("/{id}")
    @Transactional
    public Object updateMeal(@RequestBody Meal meal, @PathVariable Long id) {
        Optional<Meal> existingOpt = mealRepository.findById(id);
        if (existingOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Meal existing = existingOpt.get();
        if (meal.getName() != null) existing.setName(meal.getName());
        if (meal.getCategory() != null) existing.setCategory(meal.getCategory());
        if (meal.getGoal() != null) existing.setGoal(meal.getGoal());
        if (meal.getCalories() != null) existing.setCalories(meal.getCalories());
        if (meal.getProtein() != null) existing.setProtein(meal.getProtein());
        if (meal.getCarbs() != null) existing.setCarbs(meal.getCarbs());
        if (meal.getFat() != null) existing.setFat(meal.getFat());
        if (meal.getDescription() != null) existing.setDescription(meal.getDescription());
        if (meal.getUrl() != null) existing.setUrl(meal.getUrl());
        if (meal.getIsActive() != null) existing.setIsActive(meal.getIsActive());

        Meal updated = mealRepository.save(existing);
        return ResponseEntity.ok(updated);
    }

    /**
     * Delete a meal (soft delete preferred)
     */
    @DeleteMapping("/{id}")
    @Transactional
    public Object deleteMeal(@PathVariable Long id) {
        Optional<Meal> existingOpt = mealRepository.findById(id);
        if (existingOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Meal meal = existingOpt.get();
        meal.setIsActive(false);
        mealRepository.save(meal);

        return ResponseEntity.ok("Meal deactivated successfully");
    }
}
