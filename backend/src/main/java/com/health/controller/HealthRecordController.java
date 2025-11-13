package com.health.controller;

import com.health.dto.HealthRecordRequestDTO;
import com.health.dto.admin.HealthRecordResponse;
import com.health.dto.common.ApiResponse;
import com.health.entity.HealthRecord;
import com.health.exception.UnauthorizedException;
import com.health.repository.HealthRecordRepository;
import com.health.repository.UserProfileRepo;
import com.health.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/health-records")
@RequiredArgsConstructor
public class HealthRecordController {

    private final HealthRecordRepository healthRecordRepository;
    private final UserRepository userRepository;
    private final UserProfileRepo userProfileRepo;

    @GetMapping("/my")
    @Transactional(readOnly = true)
    public Object getMyRecords(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        var user = userRepository.findByEmail(authentication.getName()).orElseThrow(() -> new UnauthorizedException("User not found"));
        return healthRecordRepository.findByUserOrderByDateDesc(user).stream()
                .map(HealthRecordResponse::mapToDto)
                .toList();
    }

    @PostMapping
    @Transactional
    public Object addRecord(
            Authentication authentication,
            @RequestBody HealthRecordRequestDTO record
    ) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        var user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new UnauthorizedException("User not found"));

        // Nếu không gửi ngày → lấy ngày hôm nay
        LocalDate date = record.getDate() != null ? record.getDate() : LocalDate.now();

        // Tìm xem ngày đó đã có record chưa
        var existingOpt = healthRecordRepository.findByUserAndDate(user, date);

        HealthRecord target;
        boolean isUpdate = false;

        if (existingOpt.isPresent()) {
            // UPDATE
            target = existingOpt.get();
            isUpdate = true;

            target.setWeight(record.getWeight());
            target.setHeartRate(record.getHeartRate());
            target.setSleepHours(record.getSleepHours());
            target.setNote(record.getNote());
        } else {
            // CREATE NEW
            target = new HealthRecord();
            target.setUser(user);
            target.setDate(date);
            target.setWeight(record.getWeight());
            target.setHeartRate(record.getHeartRate());
            target.setSleepHours(record.getSleepHours());
            target.setNote(record.getNote());
        }

        // ==== TÍNH BMI ====
        if (target.getWeight() != null &&
                user.getProfile().getHeightCm() != null &&
                user.getProfile().getHeightCm().doubleValue() > 0) {

            double heightM = user.getProfile().getHeightCm().doubleValue() / 100.0;
            double bmi = target.getWeight() / (heightM * heightM);
            target.setBmi(Math.round(bmi * 100.0) / 100.0);
        }

        healthRecordRepository.save(target);

        return ResponseEntity.ok(
                ApiResponse.success(isUpdate ? "Updated existing record" : "Created new record")
        );
    }
}

