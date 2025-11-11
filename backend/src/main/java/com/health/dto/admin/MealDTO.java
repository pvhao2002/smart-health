package com.health.dto.admin;

import com.health.entity.Meal;
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

    public MealDTO(Meal meal) {
        this.id = meal.getId();
        this.name = meal.getName();
    }
}
