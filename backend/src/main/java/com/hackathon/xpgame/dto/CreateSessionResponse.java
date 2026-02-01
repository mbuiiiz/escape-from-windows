package com.hackathon.xpgame.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.databind.JsonNode;

public class CreateSessionResponse {
    private String sessionId;
    private LocalDateTime createdAt;
    private JsonNode game;

    public CreateSessionResponse() {
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public JsonNode getGame() {
        return game;
    }

    public void setGame(JsonNode game) {
        this.game = game;
    }
}
