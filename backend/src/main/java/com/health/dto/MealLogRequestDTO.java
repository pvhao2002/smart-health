package com.health.dto;

import com.health.entity.MealType;
import lombok.Data;

@Data
public class MealLogRequestDTO {
    private String date;          // yyyy-MM-dd
    private Long mealId;
    private Double quantity;
    private String note;
    private MealType mealType;    // BREAKFAST, LUNCH, DINNER, SNACK, OTHER
}

