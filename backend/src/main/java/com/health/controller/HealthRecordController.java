package com.health.controller;

import com.health.entity.HealthRecord;
import com.health.entity.User;
import com.health.exception.UnauthorizedException;
import com.health.repository.HealthRecordRepository;
import com.health.repository.UserProfileRepo;
import com.health.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
    public List<HealthRecord> getMyRecords(@AuthenticationPrincipal User user) {
        if (user == null) {
            throw new UnauthorizedException("User not authenticated");
        }
        return healthRecordRepository.findByUserOrderByDateDesc(user);
    }

    @PostMapping
    public HealthRecord addRecord(@AuthenticationPrincipal User user, @RequestBody HealthRecord record) {
        if (user == null) {
            throw new UnauthorizedException("User not authenticated");
        }
        var u = userRepository.findByEmail(user.getEmail()).orElseThrow(() -> new UnauthorizedException("User not found"));
        var profile = userProfileRepo.findByUser(u).orElseThrow(() -> new UnauthorizedException("User not found"));
        record.setUser(user);
        record.setDate(LocalDate.now());

        return healthRecordRepository.save(record);
    }
}

