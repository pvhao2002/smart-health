package com.health.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "meal_logs",
        indexes = {
                @Index(name = "idx_meal_log_user_date", columnList = "user_id, date")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MealLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Người dùng (1 user có thể có nhiều MealLog)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Món ăn đã chọn
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "meal_id", nullable = false)
    private Meal meal;

    @Enumerated(EnumType.STRING)
    @Column(name = "meal_type", nullable = false, length = 20)
    private MealType mealType;

    // Ngày ăn
    @Column(nullable = false)
    private LocalDateTime date;

    // Số lượng khẩu phần
    @Column(nullable = false)
    private Double quantity;

    // Tổng calo (quantity × meal.calories)
    @Column(name = "total_calories")
    private Double totalCalories;

    // Ghi chú thêm
    @Column(columnDefinition = "TEXT")
    private String note;

    // Ngày tạo log
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // Tự động gán thời điểm khi tạo mới
    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();

        // Nếu totalCalories chưa set, tự tính từ meal và quantity
        if (meal != null && totalCalories == null && meal.getCalories() != null && quantity != null) {
            totalCalories = meal.getCalories() * quantity;
        }
    }
}
