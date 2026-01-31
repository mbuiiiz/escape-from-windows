package com.hackathon.xpgame.model;

import java.time.LocalDateTime;

public class PlayerSession {
    private String sessionId;
    private String playerName;
    private ProgressState progress;
    private LocalDateTime createdAt;
    private LocalDateTime lastAccessed;

    public PlayerSession() {
        this.progress = new ProgressState();
        this.createdAt = LocalDateTime.now();
        this.lastAccessed = LocalDateTime.now();
    }

    // TODO: Add getters and setters
    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public String getPlayerName() {
        return playerName;
    }

    public void setPlayerName(String playerName) {
        this.playerName = playerName;
    }

    public ProgressState getProgress() {
        return progress;
    }

    public void setProgress(ProgressState progress) {
        this.progress = progress;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getLastAccessed() {
        return lastAccessed;
    }

    public void setLastAccessed(LocalDateTime lastAccessed) {
        this.lastAccessed = lastAccessed;
    }
}