package com.workflow.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.workflow.model.DeviceInfo;
import com.workflow.model.User;

@Repository
public interface DeviceInfoRepository extends JpaRepository<DeviceInfo, Long> {
    Optional<DeviceInfo> findFirstByUserOrderByIdDesc(User user);
    List<DeviceInfo> findAllByUser(User user);
}