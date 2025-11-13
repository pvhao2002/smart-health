package com.health.service.impl;

import com.health.dto.admin.UpdateUserStatusRequest;
import com.health.dto.admin.UserResponse;
import com.health.dto.common.MessageResponse;
import com.health.dto.common.PagedResponse;
import com.health.dto.user.ChangePasswordRequest;
import com.health.dto.user.UpdateUserProfileRequest;
import com.health.dto.user.UserProfileResponse;
import com.health.entity.User;
import com.health.exception.ResourceNotFoundException;
import com.health.exception.ValidationException;
import com.health.repository.UserProfileRepo;
import com.health.repository.UserRepository;
import com.health.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.Period;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class UserServiceImpl implements UserService {
    private final UserProfileRepo userProfileRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<UserResponse> getAllUsers(int page, int size, String search) {
        var pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Specification<User> spec = Specification.where(null);

        if (search != null && !search.trim().isEmpty()) {
            String searchTerm = "%" + search.toLowerCase() + "%";
            spec = spec.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.or(
                            criteriaBuilder.like(criteriaBuilder.lower(root.get("email")), searchTerm),
                            criteriaBuilder.like(criteriaBuilder.lower(root.get("fullName")), searchTerm),
                            criteriaBuilder.like(criteriaBuilder.lower(root.get("phone")), searchTerm)
                    )
            );
        }

        var userPage = userRepository.findAll(spec, pageable);

        var userResponses = userPage.getContent().stream()
                .map(this::mapToUserResponse)
                .collect(Collectors.toList());

        return PagedResponse.<UserResponse>builder()
                .content(userResponses)
                .page(userPage.getNumber())
                .size(userPage.getSize())
                .totalElements(userPage.getTotalElements())
                .totalPages(userPage.getTotalPages())
                .first(userPage.isFirst())
                .last(userPage.isLast())
                .hasNext(userPage.hasNext())
                .hasPrevious(userPage.hasPrevious())
                .build();
    }

    @Override
    public UserResponse updateUserStatus(Long userId, UpdateUserStatusRequest request) {
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setIsActive(request.getIsActive());
        var savedUser = userRepository.save(user);

        return mapToUserResponse(savedUser);
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserById(Long userId) {
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return mapToUserResponse(user);
    }

    @Override
    @Transactional(readOnly = true)
    public UserProfileResponse getUserProfile(String userEmail) {
        var user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return mapToUserProfileResponse(user);
    }

    @Override
    public UserProfileResponse updateUserProfile(String userEmail, UpdateUserProfileRequest req) {
        var user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        var profile = userProfileRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("User profile not found"));

        if (StringUtils.hasText(req.getFullName())) user.setFullName(req.getFullName());
        if (req.getBirthDate() != null) {
            int age = Period.between(req.getBirthDate(), LocalDate.now()).getYears();
            profile.setAge(age);
            profile.setBirthDate(req.getBirthDate());
        }
        if (req.getHeightCm() != null) profile.setHeightCm(req.getHeightCm());
        if (req.getWeightKg() != null) profile.setWeightKg(req.getWeightKg());
        if (req.getTargetWeightKg() != null) profile.setTargetWeightKg(req.getTargetWeightKg());
        if (req.getGoal() != null) profile.setGoal(req.getGoal());
        if (req.getActivityLevel() != null) profile.setActivityLevel(req.getActivityLevel());

        if (profile.getHeightCm() != null && profile.getWeightKg() != null) {
            BigDecimal heightM = profile.getHeightCm().divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP);
            BigDecimal bmi = profile.getWeightKg().divide(heightM.pow(2), 2, RoundingMode.HALF_UP);
            profile.setBmi(bmi);
        }

        if (profile.getWeightKg() != null &&
                profile.getHeightCm() != null &&
                profile.getAge() != null &&
                profile.getGender() != null) {

            double weight = profile.getWeightKg().doubleValue();
            double height = profile.getHeightCm().doubleValue();
            int age = profile.getAge();

            double bmr;
            if (profile.getGender().name().equals("MALE")) {
                bmr = 10 * weight + 6.25 * height - 5 * age + 5;
            } else {
                bmr = 10 * weight + 6.25 * height - 5 * age - 161;
            }

            profile.setBmr(BigDecimal.valueOf(bmr));
        }

        if (profile.getBmr() != null && profile.getActivityLevel() != null) {
            double tdee = profile.getBmr().doubleValue() * profile.getActivityLevel().getFactor();
            profile.setTdee(BigDecimal.valueOf(tdee));
        }

        userRepository.save(user);
        userProfileRepository.save(profile);
        return UserProfileResponse.builder().build();
    }

    @Override
    public MessageResponse changePassword(String userEmail, ChangePasswordRequest request) {
        var user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new ValidationException("Current password is incorrect");
        }

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new ValidationException("New password and confirmation do not match");
        }

        if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
            throw new ValidationException("New password must be different from current password");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return MessageResponse.builder()
                .message("Password changed successfully")
                .build();
    }


    private UserResponse mapToUserResponse(User user) {

        UserResponse.UserResponseBuilder builder = UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .isActive(user.getIsActive())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt());

        return builder.build();
    }

    private UserProfileResponse mapToUserProfileResponse(User user) {
        UserProfileResponse.UserProfileResponseBuilder builder = UserProfileResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .age(user.getProfile().getAge())
                .birthDate(user.getProfile().getBirthDate())
                .bmi(user.getProfile().getBmi())
                .bmr(user.getProfile().getBmr())
                .tdee(user.getProfile().getTdee())
                .heightCm(user.getProfile().getHeightCm())
                .weightKg(user.getProfile().getWeightKg())
                .goal(user.getProfile().getGoal())
                .targetWeightKg(user.getProfile().getTargetWeightKg())
                .activityLevel(user.getProfile().getActivityLevel())
                .isActive(user.getIsActive())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt());
        return builder.build();
    }
}
