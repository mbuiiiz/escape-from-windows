# Escape from Windows

*Built at xhacks 2026*

## Overview

Escape from Windows is an interactive puzzle adventure game that recreates the nostalgic Windows XP environment. Players solve challenges, explore virtual desktops, and unlock endings as they navigate a retro-inspired digital world.

**Tagline:**
> Escape from Windows: Solve, Explore, and Unlock the XP Adventure!

## 💡 Inspiration

Inspired by the nostalgia of Windows XP and the thrill of puzzle-solving, we set out to create an interactive adventure that blends retro aesthetics with modern web technology. We wanted to evoke memories of classic operating systems while challenging players with creative, logic-based tasks.

## 🎯 What it does

Escape from Windows is a browser-based puzzle adventure game that simulates a Windows XP environment. Players explore virtual desktops, interact with familiar apps, and solve a series of challenges to unlock multiple endings. The game combines exploration, problem-solving, and storytelling in a unique digital world.

## 🛠️ How we built it

- **Frontend:** React, Vite, TypeScript, React Router, React Query, Sonner (toast notifications), custom CSS
- **Backend:** Java (Spring Boot), Python (for game logic and puzzle generation)
- **Database:** h2
- **APIs & Services:** RESTful APIs for frontend-backend communication
- **Other Tools:** Docker, Docker Compose, ESLint, TanStack Query

## Challenges we ran into

- Recreating the authentic look and feel of Windows XP required detailed UI work and custom styling.
- Integrating multiple technologies (React, Java, Python) and ensuring smooth communication between frontend and backend.
- Designing puzzles that are both challenging and accessible to a wide audience.
- Debugging proxy and API connection issues, such as ECONNREFUSED errors when the backend was unavailable.

## Accomplishments that we're proud of

- Delivering a seamless, nostalgic user experience that resonates with players.
- Building a robust, scalable architecture using modern web tools.
- Creating engaging puzzles and multiple endings to enhance replayability.

## What we learned

- Advanced React patterns and state management with React Query.
- How to design and implement RESTful APIs for game logic.
- The importance of thorough testing and debugging, especially in multi-service environments.
- How to use Docker for consistent development and deployment.

## What's next for Escape from Windows

- Expanding the game with new puzzles, storylines, and interactive elements.
- Adding multiplayer or competitive modes.
- Improving accessibility and mobile support.
- Exploring more advanced math-based puzzles, possibly using LaTeX for in-game hints or solutions, such as:
  - In-line math: \( x^2 + y^2 = r^2 \)
  - Displayed equations:
    $$
    \int_{0}^{\infty} e^{-x^2} dx = \frac{\sqrt{\pi}}{2}
    $$

## 🎥 Demo

(Add demo link or screenshots here)

## 🚦 Getting Started

### Prerequisites

```bash
# List any required software, API keys, or accounts needed
- Node.js v14+
- Python 3.8+
# (Add any API keys or services if needed)
```

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/escape-from-windows.git

# Navigate to the project directory
cd escape-from-windows

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies (if needed)
cd ../backend
# For Java: ./mvnw install
# For Python: pip install -r requirements.txt
#Docker install then run docker-compose up --build for successful run


# Set up environment variables
# cp .env.example .env
# Add your API keys and configuration to .env

# Run the application (see Docker or manual instructions)
```

## 🤝 Team

- **[Name]** - [Role] - [GitHub](https://github.com/username) | [LinkedIn](https://linkedin.com/in/username)
- **[Name]** - [Role] - [GitHub](https://github.com/username) | [LinkedIn](https://linkedin.com/in/username)
- **[Name]** - [Role] - [GitHub](https://github.com/username) | [LinkedIn](https://linkedin.com/in/username)

## 🙏 Acknowledgments

- xhacks organizers and mentors
- Any libraries, tutorials, or resources that helped you
- Inspiration sources or similar projects

**Made with ❤️ at xhacks**
# Hackathon Web Game Monorepo (Template)

## Repo structure

```
/
  frontend/        # Vite + React template (do not modify in this scaffolding task)
  backend/         # Spring Boot (template only; no implementation yet)
  docker-compose.yml
  .env.example
  README.md
```

## Notes

- `frontend/` is an existing default Vite + React template.
- `backend/` is scaffolding only (folders + placeholder files).
- Docker is **optional** and must not be required for non-Docker workflows.

## Team ownership rules (minimize merge conflicts)

Backend ownership:
- Dev A: `config/`, `controller/`, `dto/`, `model/`, `repo/`
- Dev B: `service/`, `service/puzzle/`, `service/filesystem/`, `error/`
