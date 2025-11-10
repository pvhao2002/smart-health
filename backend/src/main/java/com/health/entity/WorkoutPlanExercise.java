package com.health.entity;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@Entity
@Table(name = "workout_plan_exercises")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkoutPlanExercise implements Serializable {
    @EmbeddedId
    private WorkoutPlanExerciseId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("workoutPlanId")
    private WorkoutPlan workoutPlan;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("exerciseId")
    private Exercise exercise;

    private Integer dayOfWeek;
    private Integer sets;
    private Integer reps;
    private Integer durationMin;
}