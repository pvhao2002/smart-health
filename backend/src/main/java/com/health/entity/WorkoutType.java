package com.health.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.context.annotation.Description;

@Entity
@Table(name = "workout_type")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkoutType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String name;
    private Double caloriesPerMinute;
    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String url; // url of youtube video demo

    @Enumerated(EnumType.STRING)
    private Level level = Level.BEGINNER;

    @Enumerated(EnumType.STRING)
    private Goal goal = Goal.LOSE_WEIGHT;

    private Boolean isActive = true;
}
