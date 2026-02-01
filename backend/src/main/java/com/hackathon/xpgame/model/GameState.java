package com.hackathon.xpgame.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;

@Entity
public class GameState {
    @Id
    private String sessionId;

    @Lob
    private String gameJson;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public GameState() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public GameState(String sessionId, String gameJson) {
        this();
        this.sessionId = sessionId;
        this.gameJson = gameJson;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public String getGameJson() {
        return gameJson;
    }

    public void setGameJson(String gameJson) {
        this.gameJson = gameJson;
        this.updatedAt = LocalDateTime.now();
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
