package com.health.repository;

import com.health.entity.MealLog;
import com.health.entity.MealType;
import com.health.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface MealLogRepository extends JpaRepository<MealLog, Long>, JpaSpecificationExecutor<MealLog> {
    List<MealLog> findByUserOrderByDateDesc(User user);

    List<MealLog> findByUserAndDateOrderByMealType(User user, LocalDateTime date);

    Optional<MealLog> findByUserAndDateAndMealType(User user, LocalDateTime date, MealType mealType);
}
