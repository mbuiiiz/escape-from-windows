package com.hackathon.xpgame.model;

public class PuzzleFlag {
    private String flagId;
    private String value;
    private String description;
    private int points;

    public PuzzleFlag() {
    }

    public PuzzleFlag(String flagId, String value, String description, int points) {
        this.flagId = flagId;
        this.value = value;
        this.description = description;
        this.points = points;
    }

    public String getFlagId() {
        return flagId;
    }

    public void setFlagId(String flagId) {
        this.flagId = flagId;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getPoints() {
        return points;
    }

    public void setPoints(int points) {
        this.points = points;
    }
}