package com.health.service;

import com.health.dto.auth.AuthResponse;
import com.health.dto.auth.LoginRequest;
import com.health.dto.auth.RegisterRequest;
import com.health.entity.Gender;
import com.health.entity.Role;
import com.health.entity.User;
import com.health.entity.UserProfile;
import com.health.exception.UnauthorizedException;
import com.health.exception.ValidationException;
import com.health.repository.UserProfileRepo;
import com.health.repository.UserRepository;
import com.health.security.JwtUtil;
import com.health.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.Period;


@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final UserProfileRepo userProfileRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;


    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmailIgnoreCase(request.getEmail())) {
            throw new ValidationException("Email is already registered");
        }

        // Create new user
        var user = User.builder()
                .email(request.getEmail().toLowerCase())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .role(Role.USER)
                .isActive(true)
                .build();
        var savedUser = userRepository.save(user);

        var profile = UserProfile.builder()
                .gender(request.getGender())
                .heightCm(request.getHeightCm())
                .weightKg(request.getWeightKg())
                .birthDate(request.getBirthDate())
                .activityLevel(request.getActivityLevel())
                .goal(request.getGoal())
                .targetWeightKg(request.getTargetWeightKg())
                .user(savedUser)
                .build();

        if (request.getHeightCm() != null && request.getWeightKg() != null && request.getBirthDate() != null && request.getGender() != null) {
            double height = request.getHeightCm().doubleValue();
            double weight = request.getWeightKg().doubleValue();
            int age = Period.between(request.getBirthDate(), LocalDate.now()).getYears();

            // BMI = weight / (height_m)^2
            double bmi = weight / Math.pow(height / 100, 2);
            profile.setBmi(BigDecimal.valueOf(bmi).setScale(2, RoundingMode.HALF_UP));

            // BMR (Harris-Benedict)
            double bmr = (request.getGender() == Gender.MALE)
                    ? 88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)
                    : 447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age);
            profile.setBmr(BigDecimal.valueOf(bmr).setScale(2, RoundingMode.HALF_UP));

            // TDEE = BMR * hệ số hoạt động
            double factor = request.getActivityLevel() != null ? request.getActivityLevel().getFactor() : 1.2;
            double tdee = bmr * factor;
            profile.setTdee(BigDecimal.valueOf(tdee).setScale(2, RoundingMode.HALF_UP));
        }

        userProfileRepo.save(profile);

        var userDetails = UserPrincipal.create(savedUser);
        var token = jwtUtil.generateToken(userDetails);
        var refreshToken = jwtUtil.generateRefreshToken(userDetails);

        return AuthResponse.builder()
                .token(token)
                .refreshToken(refreshToken)
                .type("Bearer")
                .id(savedUser.getId())
                .email(savedUser.getEmail())
                .fullName(savedUser.getFullName())
                .role(savedUser.getRole().name())
                .build();
    }

    public AuthResponse login(LoginRequest request, Boolean loginAdmin) {
        try {
            var authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail().toLowerCase(),
                            request.getPassword()
                    )
            );

            var userPrincipal = (UserPrincipal) authentication.getPrincipal();

            if (!userPrincipal.getIsActive()) {
                throw new UnauthorizedException("Account is deactivated");
            }

            if (loginAdmin != null && loginAdmin && !Role.ADMIN.equals(userPrincipal.getRole())) {
                throw new UnauthorizedException("Access denied");
            }

            var token = jwtUtil.generateToken(userPrincipal);
            var refreshToken = jwtUtil.generateRefreshToken(userPrincipal);

            return AuthResponse.builder()
                    .token(token)
                    .refreshToken(refreshToken)
                    .type("Bearer")
                    .id(userPrincipal.getId())
                    .email(userPrincipal.getEmail())
                    .fullName(userPrincipal.getFullName())
                    .role(userPrincipal.getRole().name())
                    .build();

        } catch (BadCredentialsException e) {
            throw new UnauthorizedException("Invalid email or password");
        }
    }

    public AuthResponse refreshToken(String refreshToken) {
        try {
            if (!jwtUtil.isTokenValid(refreshToken)) {
                throw new RuntimeException("Invalid refresh token");
            }

            var email = jwtUtil.getUsernameFromToken(refreshToken);
            var user = userRepository.findByEmailIgnoreCase(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (!user.getIsActive()) {
                throw new RuntimeException("Account is deactivated");
            }

            var userDetails = UserPrincipal.create(user);
            var newToken = jwtUtil.generateToken(userDetails);
            var newRefreshToken = jwtUtil.generateRefreshToken(userDetails);
            return AuthResponse.builder()
                    .token(newToken)
                    .refreshToken(newRefreshToken)
                    .type("Bearer")
                    .id(user.getId())
                    .email(user.getEmail())
                    .fullName(user.getFullName())
                    .role(user.getRole().name())
                    .build();

        } catch (Exception e) {
            log.error("Token refresh failed: {}", e.getMessage());
            throw new RuntimeException("Token refresh failed");
        }
    }
}