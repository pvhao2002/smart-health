package com.health.dto.admin;

import com.health.entity.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserOverviewDTO {
    private Long id;
    private String fullName;
    private String email;
    private Role role;
    private Boolean isActive;

    // Thông tin hồ sơ
    private Gender gender;
    private Integer age;
    private BigDecimal heightCm;
    private BigDecimal weightKg;
    private BigDecimal bmi;
    private Goal goal;
    private ActivityLevel activityLevel;
    private BigDecimal targetWeightKg;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}