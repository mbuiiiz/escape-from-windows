package com.hackathon.xpgame.dto;

public class CreateSessionRequest {
    private String playerName;

    public CreateSessionRequest() {
    }

    public String getPlayerName() {
        return playerName;
    }

    public void setPlayerName(String playerName) {
        this.playerName = playerName;
    }
}
