package com.health.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.DayOfWeek;

@Entity
@Table(name = "workout_schedule")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkoutSchedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Tên chương trình (VD: "7-Day Fat Burning Program")
    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    private Goal goal = Goal.LOSE_WEIGHT;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DayOfWeek dayOfWeek;

    // Gắn buổi tập (VD: Cardio, HIIT, Yoga,...)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workout_id")
    private WorkoutType workout;

    private Boolean isRestDay = false;

    private Boolean isActive = true;
}
