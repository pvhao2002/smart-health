package com.health.dto.admin;

import com.health.entity.Goal;
import com.health.entity.Meal;
import com.health.entity.MealType;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MealDTO {
    private Long id;
    private String name;
    private String url;

    private Double calories;
    // Hàm lượng protein (g)
    private Double protein;
    // Hàm lượng tinh bột (g)
    private Double carbs;
    // Hàm lượng chất béo (g)
    private Double fat;

    public MealDTO(Meal meal) {
        this.id = meal.getId();
        this.name = meal.getName();
        this.url = meal.getUrl();
        this.calories = meal.getCalories();
        this.protein = meal.getProtein();
        this.carbs = meal.getCarbs();
        this.fat = meal.getFat();
    }
}
