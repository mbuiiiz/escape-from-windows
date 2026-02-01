package com.hackathon.xpgame.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hackathon.xpgame.model.PlayerSession;
import com.hackathon.xpgame.repo.SessionRepository;

@Service
public class SessionService {

    @Autowired
    private SessionRepository sessionRepository;

    public PlayerSession createSession(String playerName) {
        PlayerSession session = new PlayerSession();
        session.setPlayerName(playerName);
        return sessionRepository.save(session);
    }

    public Optional<PlayerSession> getSession(String sessionId) {
        return sessionRepository.findById(sessionId);
    }

    public PlayerSession updateSession(PlayerSession session) {
        return sessionRepository.save(session);
    }

    // TODO: Add more session management methods
}
