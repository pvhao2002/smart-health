package com.health.entity;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.math.BigDecimal;

@Entity
@Table(name = "diet_plan_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DietPlanItem implements Serializable {
    @EmbeddedId
    private DietPlanItemId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("dietPlanId")
    private DietPlan dietPlan;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("recipeId")
    private Recipe recipe;

    @Enumerated(EnumType.STRING)
    private MealType mealType;
    private BigDecimal servings = BigDecimal.ONE;
}
