package com.health.controller;

import com.health.dto.MealLogRequestDTO;
import com.health.dto.MealLogResponseDTO;
import com.health.dto.common.ApiResponse;
import com.health.entity.Meal;
import com.health.entity.MealLog;
import com.health.exception.UnauthorizedException;
import com.health.repository.MealLogRepository;
import com.health.repository.MealRepository;
import com.health.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/meal-logs")
@RequiredArgsConstructor
public class MealLogController {
    private final MealLogRepository mealLogRepository;
    private final MealRepository mealRepository;
    private final UserRepository userRepository;

    @GetMapping("/my")
    @Transactional(readOnly = true)
    public ResponseEntity<?> getMyMealLogs(Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        var user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new UnauthorizedException("User not found"));

        List<MealLog> logs = mealLogRepository.findByUserOrderByDateDesc(user);

        List<MealLogResponseDTO> response = logs.stream().map(log ->
                new MealLogResponseDTO(
                        log.getId(),
                        log.getDate().toString(),
                        log.getMealType().name(),
                        log.getMeal().getName(),
                        log.getMeal().getCalories(),
                        log.getQuantity(),
                        log.getTotalCalories(),
                        log.getNote()
                )
        ).toList();

        return ResponseEntity.ok(ApiResponse.success(response));
    }


    @PostMapping
    @Transactional
    public Object addMealLog(
            Authentication authentication,
            @RequestBody MealLogRequestDTO dto
    ) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        var user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new UnauthorizedException("User not found"));

        // === Parse date ===
        LocalDate date;
        try {
            date = (dto.getDate() != null)
                    ? LocalDate.parse(dto.getDate())
                    : LocalDate.now();
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Invalid date (must be yyyy-MM-dd)");
        }

        // === Meal ===
        Meal meal = mealRepository.findById(dto.getMealId())
                .orElseThrow(() -> new RuntimeException("Meal not found"));

        // === Check existing (upsert) ===
        var existingOpt = mealLogRepository.findByUserAndDateAndMealType(user, date, dto.getMealType());

        MealLog log;
        boolean isUpdate = false;

        if (existingOpt.isPresent()) {
            log = existingOpt.get();
            isUpdate = true;
        } else {
            log = new MealLog();
            log.setUser(user);
            log.setDate(date);
            log.setMealType(dto.getMealType());
        }

        // === Update fields ===
        log.setMeal(meal);
        log.setQuantity(dto.getQuantity());
        log.setNote(dto.getNote());

        // === Auto calculate calories ===
        if (meal.getCalories() != null && dto.getQuantity() != null) {
            log.setTotalCalories(meal.getCalories() * dto.getQuantity());
        }

        mealLogRepository.save(log);

        return ResponseEntity.ok(
                ApiResponse.success(isUpdate ? "Updated meal log" : "Added meal log")
        );
    }

}
