package com.health.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

// HealthMeasurement.java
@Entity
@Table(name = "health_measurements",
        indexes = @Index(name = "idx_hm_user_time", columnList = "user_id,measured_at"))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HealthMeasurement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private LocalDateTime measuredAt;

    private BigDecimal weightKg;
    private BigDecimal bodyFatPct;
    private Integer heartRateBpm;
    private Integer bpSystolic;
    private Integer bpDiastolic;
    private BigDecimal sleepHours;
    private String note;
}
