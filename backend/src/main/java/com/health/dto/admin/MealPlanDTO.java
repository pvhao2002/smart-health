package com.health.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MealPlanDTO {
    private Long id;
    private String name;
    private String goal;
    private String dayOfWeek;

    private MealDTO breakfast;
    private MealDTO lunch;
    private MealDTO dinner;
    private MealDTO snack;

    private Double totalCalories = 0.0;
    private Double totalProtein = 0.0;
    private Double totalCarbs = 0.0;
    private Double totalFat = 0.0;
}

