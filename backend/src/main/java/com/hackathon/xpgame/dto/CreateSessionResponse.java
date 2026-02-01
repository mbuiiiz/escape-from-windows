<<<<<<< HEAD
// TODO: implement

=======
package com.hackathon.xpgame.dto;

import java.time.LocalDateTime;

public class CreateSessionResponse {
    private String sessionId;
    private LocalDateTime createdAt;

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
}
>>>>>>> backend/rest
