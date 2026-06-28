package com.workflow.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.workflow.model.DeviceInfo;
import com.workflow.model.User;
import com.workflow.repository.DeviceInfoRepository;
import com.workflow.util.SecurityUtils;

@RestController
@RequestMapping("/api/device")
public class DeviceInfoController {

    @Autowired
    private DeviceInfoRepository deviceInfoRepository;

    @Autowired
    private SecurityUtils securityUtils;

    @PostMapping("/info")
    public ResponseEntity<DeviceInfo> saveDeviceInfo(@RequestBody DeviceInfo deviceInfo) {
        User currentUser = securityUtils.getCurrentUser();
        deviceInfo.setUser(currentUser);
        DeviceInfo saved = deviceInfoRepository.save(deviceInfo);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/current")
    public ResponseEntity<DeviceInfo> getCurrentDeviceInfo() {
        User currentUser = securityUtils.getCurrentUser();
        return deviceInfoRepository.findFirstByUserOrderByIdDesc(currentUser)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}