<<<<<<< HEAD
// TODO: implement

=======
package com.hackathon.xpgame.repo;

import com.hackathon.xpgame.model.PlayerSession;
import org.springframework.stereotype.Repository;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Repository
public class InMemorySessionRepository {
    private final Map<String, PlayerSession> sessions = new ConcurrentHashMap<>();

    public PlayerSession save(PlayerSession session) {
        if (session.getSessionId() == null) {
            session.setSessionId(UUID.randomUUID().toString());
        }
        sessions.put(session.getSessionId(), session);
        return session;
    }

    public Optional<PlayerSession> findById(String sessionId) {
        return Optional.ofNullable(sessions.get(sessionId));
    }

    public void deleteById(String sessionId) {
        sessions.remove(sessionId);
    }

    public long count() {
        return sessions.size();
    }

    // TODO: Add more repository methods as needed
}
>>>>>>> backend/rest
