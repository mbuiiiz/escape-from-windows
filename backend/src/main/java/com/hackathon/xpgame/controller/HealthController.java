package com.hackathon.xpgame.controller;

import com.hackathon.xpgame.dto.HealthResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;

@RestController
@RequestMapping("/api")
public class HealthController {

    @GetMapping("/health")
    public HealthResponse getHealth() {
        // TODO: Add actual health checks if needed
        return new HealthResponse("ok", Instant.now().toString());
    }
}