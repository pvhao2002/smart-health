package com.health.controller;

import com.health.dto.HomeUserDTO;
import com.health.dto.admin.HealthRecordResponse;
import com.health.dto.admin.MealDTO;
import com.health.dto.admin.WorkoutTypeDTO;
import com.health.dto.common.ApiResponse;
import com.health.dto.user.ChangePasswordRequest;
import com.health.dto.user.UpdateUserProfileRequest;
import com.health.exception.UnauthorizedException;
import com.health.repository.HealthRecordRepository;
import com.health.repository.MealRepository;
import com.health.repository.UserRepository;
import com.health.repository.WorkoutTypeRepository;
import com.health.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {
    private final UserService userService;
    private final UserRepository userRepository;
    private final HealthRecordRepository healthRecordRepository;
    private final WorkoutTypeRepository workoutTypeRepository;
    private final MealRepository mealRepository;

    @GetMapping("my")
    @Transactional(readOnly = true)
    public Object getMyHome(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        var user = userRepository.findByEmail(authentication.getName()).orElseThrow(() -> new UnauthorizedException("User not found"));
        var yesterdayHealthRecord = healthRecordRepository.findByUserAndDate(user, LocalDate.now().minusDays(1))
                .map(HealthRecordResponse::mapToDto)
                .orElse(null);
        var todayHealthRecord = healthRecordRepository.findByUserAndDate(user, LocalDate.now())
                .map(HealthRecordResponse::mapToDto)
                .orElse(null);
        var weeklyDates = LocalDate.now().minusDays(6).datesUntil(LocalDate.now().plusDays(1)).toList();
        var weeklyHealthRecords = healthRecordRepository.findAllByUserAndDateIn(user, weeklyDates)
                .stream()
                .map(HealthRecordResponse::mapToDto)
                .toList();
        var recommendedWorkouts = workoutTypeRepository.findAllByGoalAndIsActiveTrue(user.getProfile().getGoal())
                .stream()
                .map(WorkoutTypeDTO::new)
                .toList();
        var recommendedMeals = mealRepository.findAllByGoalAndIsActiveTrue(user.getProfile().getGoal())
                .stream()
                .map(MealDTO::new)
                .toList();
        var homeUserModel = HomeUserDTO.builder()
                .yesterdaysHealthRecord(yesterdayHealthRecord)
                .todayHealthRecord(todayHealthRecord)
                .weeklyHealthRecords(weeklyHealthRecords)
                .recommendedWorkouts(recommendedWorkouts)
                .recommendedMeals(recommendedMeals)
                .build();
        return ResponseEntity.ok(ApiResponse.success(homeUserModel));
    }

    @GetMapping("/profile")
    public Object getUserProfile(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        return ResponseEntity.ok(userService.getUserProfile(authentication.getName()));
    }

    @PutMapping("/profile")
    public Object updateUserProfile(Authentication authentication, @Valid @RequestBody UpdateUserProfileRequest request) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        return ResponseEntity.ok(userService.updateUserProfile(authentication.getName(), request));
    }

    @PutMapping("/change-password")
    public Object changePassword(Authentication authentication, @Valid @RequestBody ChangePasswordRequest request) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        return ResponseEntity.ok(userService.changePassword(authentication.getName(), request));
    }
}
