package com.health.dto;

import com.health.dto.admin.HealthRecordResponse;
import com.health.dto.admin.MealDTO;
import com.health.dto.admin.MealPlanDTO;
import com.health.dto.admin.WorkoutTypeDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class HomeUserDTO {
    private HealthRecordResponse yesterdaysHealthRecord;
    private HealthRecordResponse todayHealthRecord;
    private List<HealthRecordResponse> weeklyHealthRecords;
    private List<WorkoutTypeDTO> recommendedWorkouts;
    private List<MealDTO> recommendedMeals;
}
