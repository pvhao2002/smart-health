package com.health.dto.auth;

import com.health.entity.ActivityLevel;
import com.health.entity.Gender;
import com.health.entity.Goal;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters long")
    private String password;

    @NotBlank(message = "Full name is required")
    @Size(max = 50, message = "Full name must not exceed 50 characters")
    private String fullName;

    private Gender gender = Gender.OTHER;
    private LocalDate birthDate;
    private BigDecimal heightCm;
    private BigDecimal weightKg;
    @Enumerated(EnumType.STRING)
    private ActivityLevel activityLevel = ActivityLevel.SEDENTARY;
    @Enumerated(EnumType.STRING)
    private Goal goal = Goal.MAINTAIN;
    private BigDecimal targetWeightKg;
}