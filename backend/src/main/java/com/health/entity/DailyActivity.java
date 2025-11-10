package com.health.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "daily_activities",
        uniqueConstraints = @UniqueConstraint(name = "uk_daily_user_date", columnNames = {"user_id", "activity_date"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DailyActivity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "activity_date", nullable = false)
    private LocalDate activityDate;

    private Integer steps = 0;
    private Integer caloriesIn = 0;
    private Integer caloriesOut = 0;
}

