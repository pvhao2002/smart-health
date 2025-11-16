package com.health.repository;

import com.health.entity.HealthRecord;
import com.health.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface HealthRecordRepository extends JpaRepository<HealthRecord, Long>, JpaSpecificationExecutor<HealthRecord> {
    List<HealthRecord> findByUserOrderByDateDesc(User user);

    Optional<HealthRecord> findByUserAndDate(User user, LocalDate date);
    List<HealthRecord> findAllByUserAndDateIn(User user, List<LocalDate> dates);
}
