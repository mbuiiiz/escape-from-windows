<<<<<<< HEAD
// TODO: implement

=======
package com.hackathon.xpgame.dto;

public class PuzzleAttemptRequest {
    private String sessionId;
    private String puzzleId;
    private String answer;

    public PuzzleAttemptRequest() {
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public String getPuzzleId() {
        return puzzleId;
    }

    public void setPuzzleId(String puzzleId) {
        this.puzzleId = puzzleId;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }
}
>>>>>>> backend/rest
