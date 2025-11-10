package com.health.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Enumerated(EnumType.STRING)
    private Gender gender = Gender.OTHER;
    private Integer age;
    private LocalDate birthDate;
    private BigDecimal bmi;
    private BigDecimal bmr;  // Basal Metabolic Rate
    private BigDecimal tdee; // Total Daily Energy Expenditure = BMR * activityLevelFactor
    private BigDecimal heightCm;
    private BigDecimal weightKg;
    @Enumerated(EnumType.STRING)
    private ActivityLevel activityLevel = ActivityLevel.SEDENTARY;
    @Enumerated(EnumType.STRING)
    private Goal goal = Goal.MAINTAIN;
    private BigDecimal targetWeightKg;
    @CreationTimestamp
    private LocalDateTime createdAt;
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
