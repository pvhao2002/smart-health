package com.health.dto.user;

import com.health.entity.ActivityLevel;
import com.health.entity.Goal;
import com.health.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Response DTO for user profile information.
 * Contains user's personal information and address details.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfileResponse {
    private Long id;
    private String email;
    private String fullName;

    private Integer age;
    private LocalDate birthDate;
    private BigDecimal bmi;
    private BigDecimal bmr;  // Basal Metabolic Rate
    private BigDecimal tdee; // Total Daily Energy Expenditure = BMR * activityLevelFactor
    private BigDecimal heightCm;
    private BigDecimal weightKg;
    private BigDecimal targetWeightKg;
    private Goal goal;
    private ActivityLevel activityLevel;

    private Role role;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
