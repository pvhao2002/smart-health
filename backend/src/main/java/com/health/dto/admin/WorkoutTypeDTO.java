package com.health.dto.admin;

import com.health.entity.Goal;
import com.health.entity.Level;
import com.health.entity.WorkoutType;
import com.health.util.NetworkUtils;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class WorkoutTypeDTO {
    private Long id;
    private String name;
    private Double caloriesPerMinute;
    private String description;
    private String url; // url of youtube video demo
    @Builder.Default
    private Level level = Level.BEGINNER;
    @Builder.Default
    private Goal goal = Goal.LOSE_WEIGHT;
    private Boolean isActive = true;
    private String ytbUrl;

    public WorkoutTypeDTO(WorkoutType workoutType) {
        this.id = workoutType.getId();
        this.name = workoutType.getName();
        this.caloriesPerMinute = workoutType.getCaloriesPerMinute();
        this.description = workoutType.getDescription();
        this.url = workoutType.getUrl();
        this.level = workoutType.getLevel();
        this.goal = workoutType.getGoal();
        this.isActive = workoutType.getIsActive();
        this.ytbUrl = "http://" + NetworkUtils.getLocalIpAddress() + ":3000/video?videoId=" + getVideoId(workoutType.getUrl());
    }

    public String getVideoId(String url) {
        return url.substring(url.lastIndexOf("/") + 1);
    }
}
