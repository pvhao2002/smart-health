package com.health.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.DayOfWeek;

@Entity
@Table(name = "meal_plan")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MealPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Tên kế hoạch (VD: "Weekly Weight Loss Meal Plan")
    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    private Goal goal = Goal.LOSE_WEIGHT;

    // Ngày trong tuần
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DayOfWeek dayOfWeek;

    // Mối quan hệ tới các bữa ăn trong ngày
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "breakfast_id")
    private Meal breakfast;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lunch_id")
    private Meal lunch;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dinner_id")
    private Meal dinner;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "snack_id")
    private Meal snack;

    // ✅ Tổng năng lượng và dưỡng chất của ngày
    @Column(nullable = false)
    private Double totalCalories = 0.0;

    @Column
    private Double totalProtein = 0.0;

    @Column
    private Double totalCarbs = 0.0;

    @Column
    private Double totalFat = 0.0;

    private Boolean isActive = true;

    public void calculateTotals() {
        double cal = 0, protein = 0, carbs = 0, fat = 0;

        if (breakfast != null) {
            cal += breakfast.getCalories() != null ? breakfast.getCalories() : 0;
            protein += breakfast.getProtein() != null ? breakfast.getProtein() : 0;
            carbs += breakfast.getCarbs() != null ? breakfast.getCarbs() : 0;
            fat += breakfast.getFat() != null ? breakfast.getFat() : 0;
        }
        if (lunch != null) {
            cal += lunch.getCalories() != null ? lunch.getCalories() : 0;
            protein += lunch.getProtein() != null ? lunch.getProtein() : 0;
            carbs += lunch.getCarbs() != null ? lunch.getCarbs() : 0;
            fat += lunch.getFat() != null ? lunch.getFat() : 0;
        }
        if (dinner != null) {
            cal += dinner.getCalories() != null ? dinner.getCalories() : 0;
            protein += dinner.getProtein() != null ? dinner.getProtein() : 0;
            carbs += dinner.getCarbs() != null ? dinner.getCarbs() : 0;
            fat += dinner.getFat() != null ? dinner.getFat() : 0;
        }
        if (snack != null) {
            cal += snack.getCalories() != null ? snack.getCalories() : 0;
            protein += snack.getProtein() != null ? snack.getProtein() : 0;
            carbs += snack.getCarbs() != null ? snack.getCarbs() : 0;
            fat += snack.getFat() != null ? snack.getFat() : 0;
        }

        this.totalCalories = cal;
        this.totalProtein = protein;
        this.totalCarbs = carbs;
        this.totalFat = fat;
    }

    @PrePersist
    @PreUpdate
    private void beforeSave() {
        calculateTotals();
    }
}
