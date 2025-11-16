package com.health.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class HealthRecordRequestDTO {
    private LocalDate date;       // ISO yyyy-MM-dd
    private Double weight;
    private Integer heartRate;
    private Double sleepHours;
    private Integer steps;
    private Double distance;
    private Integer caloriesBurned;
    private String note;
}
