package com.hackathon.xpgame.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hackathon.xpgame.dto.UsbAccessResponse;
import com.hackathon.xpgame.model.PlayerSession;

@Service
public class UsbAccessService {

    private static final int MAX_ATTEMPTS = 20;
    private static final int LOCKOUT_STREAK = 5;
    private static final int LOCKOUT_MINUTES = 1;

    @Autowired
    private SessionService sessionService;

    public UsbAccessResponse attempt(String sessionId, String password) {
        PlayerSession session = sessionService.getSession(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        if (session.isUsbUnlocked()) {
            return new UsbAccessResponse(true, false, false, attemptsLeft(session), session.getUsbLockoutUntil(),
                    "USB already unlocked.");
        }

        if (session.isUsbBlocked()) {
            return new UsbAccessResponse(false, true, false, 0, session.getUsbLockoutUntil(),
                    "USB access blocked. Use the cracking method.");
        }

        LocalDateTime now = LocalDateTime.now();
        if (session.getUsbLockoutUntil() != null && now.isBefore(session.getUsbLockoutUntil())) {
            return new UsbAccessResponse(false, false, true, attemptsLeft(session), session.getUsbLockoutUntil(),
                    "Too many failed attempts. Try again later.");
        }

        String expected = session.getGeneratorPassword();
        if (expected != null && expected.equals(password)) {
            session.setUsbUnlocked(true);
            session.setUsbFailedAttemptsStreak(0);
            session.setUsbLockoutUntil(null);
            sessionService.updateSession(session);
            return new UsbAccessResponse(true, false, false, attemptsLeft(session), null, "USB unlocked.");
        }

        int total = session.getUsbFailedAttemptsTotal() + 1;
        int streak = session.getUsbFailedAttemptsStreak() + 1;
        session.setUsbFailedAttemptsTotal(total);
        session.setUsbFailedAttemptsStreak(streak);

        if (total >= MAX_ATTEMPTS) {
            session.setUsbBlocked(true);
        }

        if (streak >= LOCKOUT_STREAK) {
            session.setUsbLockoutUntil(now.plusMinutes(LOCKOUT_MINUTES));
            session.setUsbFailedAttemptsStreak(0);
        }

        sessionService.updateSession(session);

        boolean blocked = session.isUsbBlocked();
        boolean locked = session.getUsbLockoutUntil() != null && now.isBefore(session.getUsbLockoutUntil());
        String message;
        if (blocked) {
            message = "USB access blocked. Use the cracking method.";
        } else if (locked) {
            message = "Too many failed attempts. Try again later.";
        } else {
            message = "Incorrect password.";
        }

        return new UsbAccessResponse(false, blocked, locked, attemptsLeft(session), session.getUsbLockoutUntil(),
                message);
    }

    private int attemptsLeft(PlayerSession session) {
        return Math.max(0, MAX_ATTEMPTS - session.getUsbFailedAttemptsTotal());
    }
}
