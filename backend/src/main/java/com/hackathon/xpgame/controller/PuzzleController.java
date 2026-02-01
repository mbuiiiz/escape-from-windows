<<<<<<< HEAD
// TODO: implement

=======
package com.hackathon.xpgame.controller;

import com.hackathon.xpgame.dto.PuzzleAttemptRequest;
import com.hackathon.xpgame.dto.PuzzleAttemptResponse;
import com.hackathon.xpgame.service.puzzle.PuzzleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/puzzles")
public class PuzzleController {

    @Autowired
    private PuzzleService puzzleService;

    @PostMapping("/attempt")
    public PuzzleAttemptResponse attemptPuzzle(@RequestBody PuzzleAttemptRequest request) {
        // TODO: Implement puzzle attempt processing
        return new PuzzleAttemptResponse();
    }
}
>>>>>>> backend/rest
