package com.health.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "meals")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Meal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Tên món ăn (VD: Cơm gà, Salad cá ngừ, ...)
    @Column(nullable = false, length = 100)
    private String name;

    // Loại bữa ăn (Sáng, Trưa, Tối, Snack)
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private MealType category;

    @Enumerated(EnumType.STRING)
    private Goal goal = Goal.LOSE_WEIGHT;

    // Năng lượng (kcal)
    @Column(nullable = false)
    private Double calories;

    // Hàm lượng protein (g)
    @Column
    private Double protein;

    // Hàm lượng tinh bột (g)
    @Column
    private Double carbs;

    // Hàm lượng chất béo (g)
    @Column
    private Double fat;

    // Ghi chú hoặc mô tả thêm về món ăn
    @Column(columnDefinition = "TEXT")
    private String description;

    // Url ảnh của món ăn
    @Column(columnDefinition = "TEXT")
    private String url;

    private Boolean isActive = true;
}
