package com.hackathon.xpgame.dto;

public class PuzzleAttemptResponse {
    private boolean correct;
    private String message;
    private boolean flagUnlocked;

    public PuzzleAttemptResponse() {
    }

    public boolean isCorrect() {
        return correct;
    }

    public void setCorrect(boolean correct) {
        this.correct = correct;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public boolean isFlagUnlocked() {
        return flagUnlocked;
    }

    public void setFlagUnlocked(boolean flagUnlocked) {
        this.flagUnlocked = flagUnlocked;
    }
}