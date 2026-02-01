package com.hackathon.xpgame.service;

import java.io.IOException;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hackathon.xpgame.model.GameState;
import com.hackathon.xpgame.repo.GameStateRepository;

@Service
public class GameStateService {

    private final GameStateRepository repository;
    private final ObjectMapper objectMapper;

    @Autowired
    public GameStateService(GameStateRepository repository, ObjectMapper objectMapper) {
        this.repository = repository;
        this.objectMapper = objectMapper;
    }

    public void saveGame(String sessionId, JsonNode game) {
        String json;
        try {
            json = objectMapper.writeValueAsString(game);
        } catch (IOException e) {
            throw new RuntimeException("Failed to serialize game state", e);
        }

        GameState state = repository.findById(sessionId)
                .orElseGet(() -> new GameState(sessionId, json));
        state.setGameJson(json);
        repository.save(state);
    }

    public Optional<JsonNode> getGame(String sessionId) {
        return repository.findById(sessionId).map(state -> {
            try {
                return objectMapper.readTree(state.getGameJson());
            } catch (IOException e) {
                throw new RuntimeException("Failed to parse stored game state", e);
            }
        });
    }
}
