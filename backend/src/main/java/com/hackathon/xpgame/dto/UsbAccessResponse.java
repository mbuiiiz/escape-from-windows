package com.hackathon.xpgame.dto;

import java.time.LocalDateTime;

public class UsbAccessResponse {
    private boolean success;
    private boolean blocked;
    private boolean locked;
    private int attemptsLeft;
    private LocalDateTime lockoutUntil;
    private String message;

    public UsbAccessResponse() {}

    public UsbAccessResponse(boolean success, boolean blocked, boolean locked, int attemptsLeft, LocalDateTime lockoutUntil, String message) {
        this.success = success;
        this.blocked = blocked;
        this.locked = locked;
        this.attemptsLeft = attemptsLeft;
        this.lockoutUntil = lockoutUntil;
        this.message = message;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public boolean isBlocked() {
        return blocked;
    }

    public void setBlocked(boolean blocked) {
        this.blocked = blocked;
    }

    public boolean isLocked() {
        return locked;
    }

    public void setLocked(boolean locked) {
        this.locked = locked;
    }

    public int getAttemptsLeft() {
        return attemptsLeft;
    }

    public void setAttemptsLeft(int attemptsLeft) {
        this.attemptsLeft = attemptsLeft;
    }

    public LocalDateTime getLockoutUntil() {
        return lockoutUntil;
    }

    public void setLockoutUntil(LocalDateTime lockoutUntil) {
        this.lockoutUntil = lockoutUntil;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
