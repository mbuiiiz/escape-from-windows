package com.hackathon.xpgame.service.puzzle;

import com.hackathon.xpgame.model.PuzzleFlag;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class PuzzleRegistry {
    private final Map<String, PuzzleFlag> puzzles = new HashMap<>();

    public PuzzleRegistry() {
        // TODO: Initialize puzzles
        initializePuzzles();
    }

    private void initializePuzzles() {
        // TODO: Load puzzle definitions
        puzzles.put("example", new PuzzleFlag("example", "flag{example}", "Example puzzle", 10));
    }

    public PuzzleFlag getPuzzle(String puzzleId) {
        return puzzles.get(puzzleId);
    }

    public boolean validateAnswer(String puzzleId, String answer) {
        PuzzleFlag puzzle = puzzles.get(puzzleId);
        return puzzle != null && puzzle.getValue().equals(answer);
    }

    // TODO: Add more puzzle registry methods
}