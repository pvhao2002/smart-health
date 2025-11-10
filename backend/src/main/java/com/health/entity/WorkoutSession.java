package com.health.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "workout_sessions",
        indexes = {
                @Index(name = "idx_ws_user_time", columnList = "user_id, date")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkoutSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Liên kết đến người dùng
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Loại bài tập (chạy bộ, gym, yoga, ...)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workout_type_id", nullable = false)
    private WorkoutType workoutType;

    // Ngày tập luyện
    @Column(nullable = false)
    private LocalDate date;

    // Thời gian tập (phút)
    @Column(name = "duration_minutes", nullable = false)
    private Double durationMinutes;

    // Lượng calo tiêu thụ
    @Column(name = "calories_burned")
    private Double caloriesBurned;

    // Ghi chú (VD: "Tập chân", "Tập nhẹ buổi sáng")
    @Column(columnDefinition = "TEXT")
    private String note;

    // Ngày tạo bản ghi
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
    }
}
