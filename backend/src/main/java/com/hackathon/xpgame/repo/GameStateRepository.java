package com.hackathon.xpgame.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hackathon.xpgame.model.GameState;

public interface GameStateRepository extends JpaRepository<GameState, String> {
}
