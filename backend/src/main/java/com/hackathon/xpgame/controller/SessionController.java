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
import com.hackathon.xpgame.service.GameGeneratorService;
import com.hackathon.xpgame.service.GameStateService;
import com.hackathon.xpgame.service.SessionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/sessions")
public class SessionController {

    private static final Logger logger = LoggerFactory.getLogger(SessionController.class);

    @Autowired
    private SessionService sessionService;

    @Autowired
    private GameGeneratorService gameGeneratorService;

    @Autowired
    private GameStateService gameStateService;

    @PostMapping
    public CreateSessionResponse createSession(@RequestBody CreateSessionRequest request) {
        String playerName = request.getPlayerName();
        String seed = request.getSeed();
        PlayerSession session = sessionService.createSession(playerName);

        GameGeneratorService.GeneratedRun run = gameGeneratorService.generateRun(seed);
        session.setGeneratorSeed(run.getSeed());
        session.setGeneratorPassword(run.getPassword());
        sessionService.updateSession(session);
        logger.info("Generated USB password for session {}: {}", session.getSessionId(), run.getPassword());

        gameStateService.saveGame(session.getSessionId(), run.getGame());

        CreateSessionResponse response = new CreateSessionResponse();
        response.setSessionId(session.getSessionId());
        response.setCreatedAt(session.getCreatedAt());
        response.setGame(run.getGame());

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

    @GetMapping("/{sessionId}/game")
    public CreateSessionResponse getGame(@PathVariable String sessionId) {
        var game = gameStateService.getGame(sessionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Game not found"));

        CreateSessionResponse response = new CreateSessionResponse();
        response.setSessionId(sessionId);
        response.setGame(game);
        return response;
    }
}
