package com.hackathon.xpgame.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

@Service
public class GameGeneratorService {

    private final ObjectMapper objectMapper;

    @Autowired
    public GameGeneratorService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public GeneratedRun generateRun(String seed) {
        Path scriptPath = resolveScriptPath().toAbsolutePath();
        List<String> command = new ArrayList<>();
        command.add("python3");
        command.add(scriptPath.toString());
        if (seed != null && !seed.isBlank()) {
            command.add("--seed");
            command.add(seed);
        }

        String stdout = runCommand(command, scriptPath.getParent());
        JsonNode raw;
        try {
            raw = objectMapper.readTree(stdout);
        } catch (IOException e) {
            throw new RuntimeException("Failed to parse generator output as JSON", e);
        }

        if (!(raw instanceof ObjectNode obj)) {
            throw new RuntimeException("Generator output must be a JSON object");
        }

        JsonNode passwordNode = obj.get("password");
        String password = passwordNode != null ? passwordNode.asText() : null;
        JsonNode seedNode = obj.get("seed");
        String resolvedSeed = seedNode != null ? seedNode.asText() : null;

        obj.remove("password");

        return new GeneratedRun(resolvedSeed, password, obj);
    }

    private Path resolveScriptPath() {
        String override = System.getenv("GAME_GENERATOR_PATH");
        if (override != null && !override.isBlank()) {
            Path p = Paths.get(override);
            if (Files.exists(p)) return p;
        }

        Path defaultPath = Paths.get("src", "main", "python", "game_generator.py");
        if (Files.exists(defaultPath)) return defaultPath;

        Path repoRootPath = Paths.get("backend", "src", "main", "python", "game_generator.py");
        if (Files.exists(repoRootPath)) return repoRootPath;

        throw new RuntimeException("game_generator.py not found; set GAME_GENERATOR_PATH or run from backend/");
    }

    private String runCommand(List<String> command, Path workingDir) {
        ProcessBuilder pb = new ProcessBuilder(command);
        if (workingDir != null) {
            pb.directory(workingDir.toFile());
        }
        pb.redirectErrorStream(true);

        Process proc;
        try {
            proc = pb.start();
        } catch (IOException e) {
            throw new RuntimeException("Failed to start generator process", e);
        }

        StringBuilder out = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(proc.getInputStream(), StandardCharsets.UTF_8))) {
            String line;
            while ((line = reader.readLine()) != null) {
                out.append(line).append("\n");
            }
        } catch (IOException e) {
            proc.destroyForcibly();
            throw new RuntimeException("Failed reading generator output", e);
        }

        try {
            int code = proc.waitFor();
            if (code != 0) {
                throw new RuntimeException("Generator exited with code " + code + ":\n" + out);
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            proc.destroyForcibly();
            throw new RuntimeException("Generator interrupted", e);
        }

        return out.toString().trim();
    }

    public static class GeneratedRun {
        private final String seed;
        private final String password;
        private final ObjectNode game;

        public GeneratedRun(String seed, String password, ObjectNode game) {
            this.seed = seed;
            this.password = password;
            this.game = game;
        }

        public String getSeed() {
            return seed;
        }

        public String getPassword() {
            return password;
        }

        public ObjectNode getGame() {
            return game;
        }
    }
}
