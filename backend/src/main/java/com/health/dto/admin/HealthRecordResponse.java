package com.health.dto.admin;

import com.health.entity.HealthRecord;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HealthRecordResponse {

    private Long id;

    private LocalDate date;      // yyyy-MM-dd
    private Double weight;       // kg
    private Double bmi;          // calculated BMI
    private Integer heartRate;   // bpm
    private Double sleepHours;   // hours
    private Integer steps;
    private Double distance;
    private Integer caloriesBurned;
    private String note;         // optional note

    private LocalDateTime createdAt; // timestamp

    public static HealthRecordResponse mapToDto(HealthRecord r) {
        return HealthRecordResponse.builder()
                .id(r.getId())
                .date(r.getDate())
                .steps(r.getSteps())
                .distance(r.getDistance())
                .caloriesBurned(r.getCaloriesBurned())
                .weight(r.getWeight())
                .bmi(r.getBmi())
                .heartRate(r.getHeartRate())
                .sleepHours(r.getSleepHours())
                .note(r.getNote())
                .createdAt(r.getCreatedAt())
                .build();
    }
}
