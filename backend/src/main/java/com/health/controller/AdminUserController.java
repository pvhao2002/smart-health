package com.health.controller;

import com.health.dto.admin.UserOverviewDTO;
import com.health.entity.Role;
import com.health.entity.User;
import com.health.entity.UserProfile;
import com.health.repository.UserProfileRepo;
import com.health.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/admin/users")
@RequiredArgsConstructor
public class AdminUserController {
    private final UserRepository userRepository;
    private final UserProfileRepo userProfileRepo;

    @GetMapping
    @Transactional(readOnly = true)
    public Object getUser() {
        List<User> users = userRepository.findByIsActiveTrueAndRole(Role.USER);

        return users.stream().map(user -> {
            UserProfile profile = userProfileRepo.findByUser(user).orElse(null);

            return UserOverviewDTO.builder()
                    .id(user.getId())
                    .fullName(user.getFullName())
                    .email(user.getEmail())
                    .role(user.getRole())
                    .isActive(user.getIsActive())

                    // Profile info
                    .gender(profile != null ? profile.getGender() : null)
                    .age(profile != null ? profile.getAge() : null)
                    .heightCm(profile != null ? profile.getHeightCm() : null)
                    .weightKg(profile != null ? profile.getWeightKg() : null)
                    .bmi(profile != null ? profile.getBmi() : null)
                    .goal(profile != null ? profile.getGoal() : null)
                    .activityLevel(profile != null ? profile.getActivityLevel() : null)
                    .targetWeightKg(profile != null ? profile.getTargetWeightKg() : null)

                    .createdAt(user.getCreatedAt())
                    .updatedAt(user.getUpdatedAt())
                    .build();
        }).toList();
    }
}
