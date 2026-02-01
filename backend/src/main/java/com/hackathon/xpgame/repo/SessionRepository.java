package com.hackathon.xpgame.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hackathon.xpgame.model.PlayerSession;

public interface SessionRepository extends JpaRepository<PlayerSession, String> {
    
}
