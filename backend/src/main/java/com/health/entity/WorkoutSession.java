package com.health.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "workout_sessions",
        indexes = @Index(name = "idx_ws_user_time", columnList = "user_id,start_time"))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkoutSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exercise_id")
    private Exercise exercise;

    private String type;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Integer durationMin;
    private BigDecimal distanceKm;
    private Integer steps;
    private Integer caloriesBurned;
    private Integer perceivedExertion;   // 1..10
    private String note;
}
