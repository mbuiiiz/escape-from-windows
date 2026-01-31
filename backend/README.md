# Backend - XP Game Engine

This is the Spring Boot backend for our hackathon entry (see `../plot.md` for the story). It acts as the game engine, managing the state of the simulated Windows XP desktop environment.

## Project Structure & Responsibilities

### Controllers (`com.hackathon.xpgame.controller`)

These define the REST API endpoints the frontend (React) will call.

- **`SessionController.java`**: Manages the lifecycle of a player's game run.
  - `POST /api/session/start`: Initialize a new game session (generates the file system).
  - `GET /api/session`: Get current timer/state.
  - `POST /api/session/reset`: Reset the current session.

- **`ActionController.java`**: The main interaction handler. Instead of CRUD for every entity, we route player "actions" here.
  - `POST /api/action`: Receives actions like `OPEN_FILE`, `CLICK_ICON`, `CHANGE_TIME`, `RUN_COMMAND`.

- **`PuzzleController.java`**: Specific validation for game puzzles.
  - `POST /api/puzzle/submit`: Check if a password/code is correct.

- **`HealthController.java`**: Simple ping/health check endpoint.

### Services (`com.hackathon.xpgame.service`)

Business logic layer.

- **`SessionService.java`**: Holds the state of the active user (in-memory for now). Tracks progress (which clues found, current time in simulation).
- **`ActionService.java`**: Switchboard that delegates actions (e.g., if action is `OPEN_FILE`, ask FileSystemService).
- **`PuzzleService.java`**: Contains the logic to verify puzzle solutions (e.g., checking if the date matches the incident date).
- **`filesystem/VirtualFileSystemService.java`**: The core complexity. Simulates an OS file system.
  - Needs to support: Navigation, Reading files, "Phantom" deleted files (Recycle Bin), and File Metadata.
- **`filesystem/SeedFileSystem.java`**: Populates the initial state of the computer (the "abandoned lab" state).

### Models (`com.hackathon.xpgame.model`)

Data structures for the simulation.

- **`PlayerSession.java`**: Stores `sessionId`, `currentDirectory`, `flags` (inventory/puzzles solved), and `virtualTime`.
- **`VirtualFile.java`**: A file node. Needs: `name`, `content`, `creationDate` (crucial for metadata puzzles), `fileType` (txt, exe, img).
- **`VirtualFolder.java`**: A directory node. Contains list of children files/folders.
- **`ActionType.java`**: Enum of possible player actions (e.g., `OPEN`, `EXECUTE`, `DELETE`, `RESTORE`).

---

## Implementation Requirements (Based on Plot)

### 1. The Virtual File System (Priority High)

The plot relies heavily on file exploration. We need to implement `VirtualFileSystemService` to support:

- **Metadata Puzzles**: Files need a `creationDate` field that can be inspecting.
- **Recycle Bin**: Deleting a file shouldn't remove it from memory, but move it to a "Recycle Bin" folder or mark it `isDeleted`. The player needs to browse this to find "Forgotten files".
- **Restore Points**: We might need a way to switch the `root` folder reference to a previous version of the text files to simulate "System Restore".

### 2. The Terminal & Scripting

- **`ActionController`** needs a specific handler for "TERMINAL_INPUT".
- The "USBCode" puzzle requires parsing a simple command or checking specific syntax errors in a mock "Notepad++" file.

### 3. System Clock Modification

- One clue involves changing the date to the "date of incident".
- **`PlayerSession`** should have a `virtualDate` property.
- **`ActionService`** should allow modifying this date.
- Puzzles should check `PlayerSession.virtualDate` to reveal hidden files or unlock folders.

### 4. Interactive Applications

We need to model data for specific "apps":

- **Email (Unsent Drafts)**: Create a specific folder structure (e.g., `/Program Files/YahooMail/Drafts`) or a JSON blob representing emails.
- **Browser History**: A virtual file `history.dat` or similar that the frontend can parse to show visited sites.

### 5. Puzzles Logic

- **`PuzzleRegistry`**: Hardcode the answers here (e.g., Password = "LAB_PASSWORD_2000").
- **Login Screen**: The first barrier. Checking input against hints found in the physical room (USB content).

## Getting Started

1. Run `mvn spring-boot:run` to start the server on port 8080.
2. Check `application.properties` for config.
