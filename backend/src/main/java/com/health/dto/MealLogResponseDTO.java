package com.health.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MealLogResponseDTO {
    private Long id;
    private String date;
    private String mealType;
    private String mealName;
    private Double caloriesPerUnit;
    private Double quantity;
    private Double totalCalories;
    private String note;
}
