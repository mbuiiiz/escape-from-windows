<<<<<<< HEAD
// TODO: implement

=======
package com.hackathon.xpgame.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hackathon.xpgame.dto.CreateSessionRequest;
import com.hackathon.xpgame.dto.CreateSessionResponse;
import com.hackathon.xpgame.dto.GetSessionResponse;
import com.hackathon.xpgame.model.PlayerSession;
import com.hackathon.xpgame.service.SessionService;

@RestController
@RequestMapping("/api/sessions")
public class SessionController {

    @Autowired
    private SessionService sessionService;

    @PostMapping
    public CreateSessionResponse createSession(@RequestBody CreateSessionRequest request) {
        // TODO: Implement session creation
        String playerName = request.getPlayerName();
        PlayerSession session = sessionService.createSession(playerName);
       
        CreateSessionResponse response = new CreateSessionResponse();
        response.setSessionId(session.getSessionId());
        response.setCreatedAt(session.getCreatedAt());           
        
        return response;
    }

    @GetMapping("/{sessionId}")
    public GetSessionResponse getSession(@PathVariable String sessionId) {
        // TODO: Implement session retrieval
        PlayerSession fetchedSession = sessionService.getSession(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));
        
                GetSessionResponse response = new GetSessionResponse();
        response.setSessionId(fetchedSession.getSessionId());
        response.setProgress(fetchedSession.getProgress());
        response.setCreatedAt(fetchedSession.getCreatedAt());
        
        return response;
    }
}
>>>>>>> backend/rest
