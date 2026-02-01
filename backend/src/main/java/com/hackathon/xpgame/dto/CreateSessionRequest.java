package com.hackathon.xpgame.dto;

public class CreateSessionRequest {
    private String playerName;
    private String seed;

    public CreateSessionRequest() {
    }

    public String getPlayerName() {
        return playerName;
    }

    public void setPlayerName(String playerName) {
        this.playerName = playerName;
    }

    public String getSeed() {
        return seed;
    }

    public void setSeed(String seed) {
        this.seed = seed;
    }
}
