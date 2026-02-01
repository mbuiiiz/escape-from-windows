<<<<<<< HEAD
// TODO: implement

=======
package com.hackathon.xpgame.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Embeddable;

@Embeddable
public class ProgressState {
    private List<String> flags;
    private int currentStep;
    private List<String> completedPuzzles;

    public ProgressState() {
        this.flags = new ArrayList<>();
        this.currentStep = 0;
        this.completedPuzzles = new ArrayList<>();
    }

    public List<String> getFlags() {
        return flags;
    }

    public void setFlags(List<String> flags) {
        this.flags = flags;
    }

    public int getCurrentStep() {
        return currentStep;
    }

    public void setCurrentStep(int currentStep) {
        this.currentStep = currentStep;
    }

    public List<String> getCompletedPuzzles() {
        return completedPuzzles;
    }

    public void setCompletedPuzzles(List<String> completedPuzzles) {
        this.completedPuzzles = completedPuzzles;
    }

    // TODO: Add helper methods
    public void addFlag(String flag) {
        this.flags.add(flag);
    }

    public void addCompletedPuzzle(String puzzleId) {
        this.completedPuzzles.add(puzzleId);
    }
}
>>>>>>> backend/rest
