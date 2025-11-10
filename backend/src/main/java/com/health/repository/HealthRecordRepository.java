package com.health.repository;

import com.health.entity.HealthRecord;
import com.health.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface HealthRecordRepository extends JpaRepository<HealthRecord, Long>, JpaSpecificationExecutor<HealthRecord> {
    List<HealthRecord> findByUserOrderByDateDesc(User user);

}
