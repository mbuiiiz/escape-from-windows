package com.hackathon.xpgame.dto;

import com.hackathon.xpgame.model.ProgressState;
import java.time.LocalDateTime;

public class GetSessionResponse {
    private String sessionId;
    private ProgressState progress;
    private LocalDateTime createdAt;

    public GetSessionResponse() {
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
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
}
