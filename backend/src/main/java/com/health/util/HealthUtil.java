package com.health.util;

import lombok.experimental.UtilityClass;

import java.math.BigDecimal;

@UtilityClass
public class HealthUtil {

    public double calculateBMI(double weightKg, double heightCm) {
        if (heightCm <= 0) {
            throw new IllegalArgumentException("Height must be greater than zero");
        }
        double heightM = heightCm / 100.0;
        return weightKg / (heightM * heightM);
    }

    public double calculateBMI(BigDecimal weightKg, BigDecimal heightCm) {
        if (heightCm.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Height must be greater than zero");
        }
        return calculateBMI(weightKg.doubleValue(), heightCm.doubleValue());
    }
}
