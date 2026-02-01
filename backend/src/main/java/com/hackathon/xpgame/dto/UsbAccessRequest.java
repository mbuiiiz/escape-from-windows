package com.hackathon.xpgame.dto;

public class UsbAccessRequest {
    private String sessionId;
    private String password;

    public UsbAccessRequest() {}

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
