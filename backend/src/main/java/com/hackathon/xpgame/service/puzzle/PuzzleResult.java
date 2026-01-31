package com.hackathon.xpgame.service.puzzle;

public class PuzzleResult {
    private boolean correct;
    private String message;
    private boolean flagUnlocked;

    public PuzzleResult() {
    }

    public PuzzleResult(boolean correct, String message, boolean flagUnlocked) {
        this.correct = correct;
        this.message = message;
        this.flagUnlocked = flagUnlocked;
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