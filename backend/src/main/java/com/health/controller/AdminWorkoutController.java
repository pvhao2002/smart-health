package com.health.controller;

import com.health.entity.WorkoutType;
import com.health.repository.WorkoutTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/admin/workouts")
@RequiredArgsConstructor
public class AdminWorkoutController {
    private final WorkoutTypeRepository workoutTypeRepository;

    @GetMapping
    @Transactional(readOnly = true)
    public Object getWorkoutTypes() {
        return workoutTypeRepository.findAllByIsActiveTrue();
    }

    @PostMapping
    @Transactional
    public Object addWorkoutType(@RequestBody WorkoutType workoutType) {
        if (workoutType.getName() == null || workoutType.getName().isBlank()) {
            return "Workout name cannot be empty";
        }

        // Chuẩn hóa YouTube link
        if (workoutType.getUrl() != null && !workoutType.getUrl().isBlank()) {
            workoutType.setUrl(convertToEmbedUrl(workoutType.getUrl()));
        }

        return workoutTypeRepository.save(workoutType);
    }

    @PatchMapping("/{id}")
    @Transactional
    public Object updateWorkoutType(@RequestBody WorkoutType workoutType, @PathVariable Long id) {
        Optional<WorkoutType> existingOpt = workoutTypeRepository.findById(id);
        if (existingOpt.isEmpty()) {
            return "Workout not found";
        }

        WorkoutType existing = existingOpt.get();

        if (workoutType.getName() != null) existing.setName(workoutType.getName());
        if (workoutType.getCaloriesPerMinute() != null)
            existing.setCaloriesPerMinute(workoutType.getCaloriesPerMinute());
        if (workoutType.getDescription() != null) existing.setDescription(workoutType.getDescription());
        if (workoutType.getGoal() != null) existing.setGoal(workoutType.getGoal());
        if (workoutType.getLevel() != null) existing.setLevel(workoutType.getLevel());
        if (workoutType.getIsActive() != null) existing.setIsActive(workoutType.getIsActive());

        if (workoutType.getUrl() != null && !workoutType.getUrl().isBlank()) {
            existing.setUrl(convertToEmbedUrl(workoutType.getUrl()));
        }

        return workoutTypeRepository.save(existing);
    }

    @DeleteMapping("/{id}")
    @Transactional
    public Object deleteWorkoutType(@PathVariable Long id) {
        Optional<WorkoutType> existingOpt = workoutTypeRepository.findById(id);
        if (existingOpt.isEmpty()) {
            return "Workout not found";
        }

        WorkoutType workout = existingOpt.get();
        workout.setIsActive(false);
        workoutTypeRepository.save(workout);

        return "Workout deactivated successfully";
    }

    /**
     * ✅ Hàm convert YouTube URL sang embed URL
     */
    private String convertToEmbedUrl(String inputUrl) {
        if (inputUrl == null || inputUrl.isBlank()) return null;

        // Regex để bắt mã video từ các dạng phổ biến
        String regex = "(?:https?:\\/\\/)?(?:www\\.|m\\.)?(?:youtube\\.com\\/watch\\?v=|youtu\\.be\\/)([\\w\\-]{11})";
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(inputUrl);

        if (matcher.find()) {
            String videoId = matcher.group(1);
            return "https://www.youtube.com/embed/" + videoId;
        }

        // Nếu không match thì trả lại link cũ (phòng khi user nhập link embed sẵn)
        return inputUrl;
    }
}
