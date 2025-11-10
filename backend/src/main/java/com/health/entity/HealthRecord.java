package com.health.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "health_records")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HealthRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Liên kết với bảng users
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Ngày ghi nhận
    @Column(nullable = false)
    private LocalDate date;

    // Cân nặng (kg)
    @Column(nullable = false)
    private Double weight;

    // BMI được tính = weight / (height/100)^2
    @Column
    private Double bmi;

    // Nhịp tim (bpm)
    @Column
    private Integer heartRate;

    // Số giờ ngủ
    @Column
    private Double sleepHours;

    // Ghi chú tùy chọn
    @Column(length = 500)
    private String note;

    // Ngày tạo bản ghi
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // Ghi chú: dùng @PrePersist để tự động set ngày tạo
    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
    }
}
