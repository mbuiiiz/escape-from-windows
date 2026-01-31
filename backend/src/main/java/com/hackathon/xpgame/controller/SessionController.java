package com.hackathon.xpgame.controller;

import com.hackathon.xpgame.dto.CreateSessionRequest;
import com.hackathon.xpgame.dto.CreateSessionResponse;
import com.hackathon.xpgame.dto.GetSessionResponse;
import com.hackathon.xpgame.service.SessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/sessions")
public class SessionController {

    @Autowired
    private SessionService sessionService;

    @PostMapping
    public CreateSessionResponse createSession(@RequestBody CreateSessionRequest request) {
        // TODO: Implement session creation
        return new CreateSessionResponse();
    }

    @GetMapping("/{sessionId}")
    public GetSessionResponse getSession(@PathVariable String sessionId) {
        // TODO: Implement session retrieval
        return new GetSessionResponse();
    }
}