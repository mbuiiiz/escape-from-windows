package com.hackathon.xpgame.model;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Transient;

@Entity
public class PlayerSession {

    @Id
    private String sessionId;
    private String playerName;
    @Transient
    private ProgressState progress;
    private LocalDateTime createdAt;
    private LocalDateTime lastAccessed;
    private String generatorSeed;
    private String generatorPassword;
    private boolean usbUnlocked;
    private boolean usbBlocked;
    private int usbFailedAttemptsTotal;
    private int usbFailedAttemptsStreak;
    private LocalDateTime usbLockoutUntil;

    public PlayerSession() {
        this.sessionId = UUID.randomUUID().toString();
        this.progress = new ProgressState();
        this.createdAt = LocalDateTime.now();
        this.lastAccessed = LocalDateTime.now();
    }

    // TODO: Add getters and setters
    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public String getPlayerName() {
        return playerName;
    }

    public void setPlayerName(String playerName) {
        this.playerName = playerName;
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

    public LocalDateTime getLastAccessed() {
        return lastAccessed;
    }

    public void setLastAccessed(LocalDateTime lastAccessed) {
        this.lastAccessed = lastAccessed;
    }

    public String getGeneratorSeed() {
        return generatorSeed;
    }

    public void setGeneratorSeed(String generatorSeed) {
        this.generatorSeed = generatorSeed;
    }

    public String getGeneratorPassword() {
        return generatorPassword;
    }

    public void setGeneratorPassword(String generatorPassword) {
        this.generatorPassword = generatorPassword;
    }

    public boolean isUsbUnlocked() {
        return usbUnlocked;
    }

    public void setUsbUnlocked(boolean usbUnlocked) {
        this.usbUnlocked = usbUnlocked;
    }

    public boolean isUsbBlocked() {
        return usbBlocked;
    }

    public void setUsbBlocked(boolean usbBlocked) {
        this.usbBlocked = usbBlocked;
    }

    public int getUsbFailedAttemptsTotal() {
        return usbFailedAttemptsTotal;
    }

    public void setUsbFailedAttemptsTotal(int usbFailedAttemptsTotal) {
        this.usbFailedAttemptsTotal = usbFailedAttemptsTotal;
    }

    public int getUsbFailedAttemptsStreak() {
        return usbFailedAttemptsStreak;
    }

    public void setUsbFailedAttemptsStreak(int usbFailedAttemptsStreak) {
        this.usbFailedAttemptsStreak = usbFailedAttemptsStreak;
    }

    public LocalDateTime getUsbLockoutUntil() {
        return usbLockoutUntil;
    }

    public void setUsbLockoutUntil(LocalDateTime usbLockoutUntil) {
        this.usbLockoutUntil = usbLockoutUntil;
    }
}
