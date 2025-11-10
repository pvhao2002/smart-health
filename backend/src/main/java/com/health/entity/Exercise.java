package com.health.entity;

import jakarta.persistence.*;
import lombok.*;


import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "exercises")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Exercise {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String name;
    @Enumerated(EnumType.STRING)
    private Difficulty difficulty = Difficulty.EASY;
    private String targetMuscle;
    private String equipment;
    private BigDecimal metValue;
}
