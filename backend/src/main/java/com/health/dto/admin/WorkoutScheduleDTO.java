package com.health.dto.admin;

import com.health.entity.Goal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.DayOfWeek;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class WorkoutScheduleDTO {
    private Long id;
    private String name;
    @Builder.Default
    private Goal goal = Goal.LOSE_WEIGHT;
    private DayOfWeek dayOfWeek;
    private WorkoutTypeDTO workouts;
    @Builder.Default
    private Boolean isRestDay = false;
    private Boolean isActive = true;
}
