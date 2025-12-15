"use client";

import { useState, useEffect, useRef } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";

/**
 * Lightweight Pac-Man mini-game easter egg
 * OPTIMIZED: Uses canvas for performance, respects reduced motion, lazy-loaded
 * Small footprint (~5KB), non-intrusive, fun easter egg
 */
export default function PacManGame() {
  const [isOpen, setIsOpen] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const canvasRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  // Game state
  const gameState = useRef({
    pacman: { x: 10, y: 10, direction: 0, mouth: 0 },
    dots: [],
    ghosts: [],
    gridSize: 20,
    cellSize: 15,
    score: 0,
    running: false,
  });

  // Initialize game
  useEffect(() => {
    if (!isOpen || shouldReduceMotion || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const state = gameState.current;

    // Set canvas size
    canvas.width = state.gridSize * state.cellSize;
    canvas.height = state.gridSize * state.cellSize;

    // Initialize dots
    state.dots = [];
    for (let y = 2; y < state.gridSize - 2; y++) {
      for (let x = 2; x < state.gridSize - 2; x++) {
        if (Math.random() > 0.3) {
          state.dots.push({ x, y });
        }
      }
    }

    // Initialize ghosts
    state.ghosts = [
      { x: 15, y: 15, direction: 0, color: "#ff0000" },
      { x: 5, y: 15, direction: 1, color: "#00ffff" },
    ];

    state.running = true;
    state.score = 0;
    setScore(0);
    setGameOver(false);

    // Game loop
    let lastTime = 0;
    const gameLoop = (currentTime) => {
      if (!state.running) return;

      const deltaTime = currentTime - lastTime;
      if (deltaTime < 100) {
        requestAnimationFrame(gameLoop);
        return;
      }
      lastTime = currentTime;

      // Update pacman mouth animation
      state.pacman.mouth = (state.pacman.mouth + 0.2) % (Math.PI * 2);

      // Move ghosts
      state.ghosts.forEach((ghost) => {
        if (Math.random() < 0.1) {
          ghost.direction = Math.floor(Math.random() * 4);
        }
        const dirs = [
          { x: 0, y: -1 },
          { x: 1, y: 0 },
          { x: 0, y: 1 },
          { x: -1, y: 0 },
        ];
        const dir = dirs[ghost.direction];
        ghost.x = Math.max(1, Math.min(state.gridSize - 2, ghost.x + dir.x));
        ghost.y = Math.max(1, Math.min(state.gridSize - 2, ghost.y + dir.y));
      });

      // Check collisions with ghosts
      state.ghosts.forEach((ghost) => {
        if (
          Math.abs(ghost.x - state.pacman.x) < 0.8 &&
          Math.abs(ghost.y - state.pacman.y) < 0.8
        ) {
          state.running = false;
          setGameOver(true);
          return;
        }
      });

      // Draw
      ctx.fillStyle = "#1a1a2e";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw dots
      ctx.fillStyle = "#ffd700";
      state.dots.forEach((dot) => {
        const dotX = dot.x * state.cellSize + state.cellSize / 2;
        const dotY = dot.y * state.cellSize + state.cellSize / 2;
        ctx.beginPath();
        ctx.arc(dotX, dotY, 2, 0, Math.PI * 2);
        ctx.fill();

        // Check if pacman collected dot
        if (
          Math.abs(dot.x - state.pacman.x) < 0.5 &&
          Math.abs(dot.y - state.pacman.y) < 0.5
        ) {
          state.dots = state.dots.filter((d) => d !== dot);
          state.score += 10;
          setScore(state.score);
        }
      });

      // Draw pacman
      const pacX = state.pacman.x * state.cellSize + state.cellSize / 2;
      const pacY = state.pacman.y * state.cellSize + state.cellSize / 2;
      ctx.fillStyle = "#ffd700";
      ctx.beginPath();
      ctx.arc(
        pacX,
        pacY,
        state.cellSize / 2 - 2,
        state.pacman.mouth,
        Math.PI * 2 - state.pacman.mouth
      );
      ctx.lineTo(pacX, pacY);
      ctx.fill();

      // Draw ghosts
      state.ghosts.forEach((ghost) => {
        const ghostX = ghost.x * state.cellSize + state.cellSize / 2;
        const ghostY = ghost.y * state.cellSize + state.cellSize / 2;
        ctx.fillStyle = ghost.color;
        ctx.beginPath();
        ctx.arc(ghostX, ghostY, state.cellSize / 2 - 2, 0, Math.PI * 2);
        ctx.fill();
      });

      // Check win condition
      if (state.dots.length === 0) {
        state.running = false;
        setGameOver(true);
      }

      if (state.running) {
        requestAnimationFrame(gameLoop);
      }
    };

    requestAnimationFrame(gameLoop);

    return () => {
      state.running = false;
    };
  }, [isOpen, shouldReduceMotion]);

  // Handle keyboard input
  useEffect(() => {
    if (!isOpen || shouldReduceMotion) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        return;
      }

      const state = gameState.current;
      if (!state.running) return;

      const dirs = [
        { x: 0, y: -1 },
        { x: 1, y: 0 },
        { x: 0, y: 1 },
        { x: -1, y: 0 },
      ];

      let newDir = state.pacman.direction;
      if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") newDir = 0;
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") newDir = 1;
      if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") newDir = 2;
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") newDir = 3;

      state.pacman.direction = newDir;
      const dir = dirs[newDir];
      state.pacman.x = Math.max(
        1,
        Math.min(state.gridSize - 2, state.pacman.x + dir.x)
      );
      state.pacman.y = Math.max(
        1,
        Math.min(state.gridSize - 2, state.pacman.y + dir.y)
      );
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, shouldReduceMotion]);

  if (shouldReduceMotion) return null;

  return (
    <>
      {/* Easter egg trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-primary-400 hover:text-primary-300 transition-colors text-xs opacity-70 hover:opacity-100"
        aria-label="Öppna Cookie Arcade"
        title="Cookie Arcade"
      >
        🕹️
      </button>

      {/* Game modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-arcade-title"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            aria-hidden="true"
          />

          <div
            className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950" />
            <div className="absolute inset-0 bg-pattern-dots opacity-30" />
            <div
              className="absolute -top-24 -right-24 w-72 h-72 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,255,255,0.10) 0%, transparent 70%)",
              }}
            />
            <div
              className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)",
              }}
            />

            {/* Content */}
            <div className="relative p-6 sm:p-7 text-white">
              <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                  <h3
                    id="cookie-arcade-title"
                    className="text-2xl font-bold leading-tight bg-gradient-to-r from-white via-primary-100 to-secondary-200 bg-clip-text text-transparent"
                  >
                    Cookie Arcade
                  </h3>
                  <p className="text-white/80 text-sm mt-1">
                    Ett litet paus-spel (Esc stänger). Inget påverkar dina
                    cookie‑val.
                  </p>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/70 hover:text-white text-3xl leading-none px-2 -mt-1"
                  aria-label="Stäng"
                >
                  ×
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-3 mb-4">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10">
                  <span className="text-[11px] tracking-widest uppercase text-white/70">
                    Poäng
                  </span>
                  <span className="font-semibold">{score}</span>
                </div>

                {gameOver && (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10">
                    <span className="text-[11px] tracking-widest uppercase text-white/70">
                      Status
                    </span>
                    <span className="font-semibold">
                      {gameState.current.dots.length === 0
                        ? "Du vann"
                        : "Game Over"}
                    </span>
                  </div>
                )}

                <div className="text-xs text-white/70 ml-auto">
                  Pilar/WASD • Esc
                </div>
              </div>

              <div className="rounded-xl bg-black/35 border border-white/10 p-4 flex justify-center">
                <canvas
                  ref={canvasRef}
                  className="rounded-lg border border-white/15"
                  style={{ imageRendering: "pixelated" }}
                />
              </div>

              <div className="mt-5 flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setTimeout(() => setIsOpen(true), 120);
                  }}
                  className="flex-1 px-4 py-2.5 bg-white text-primary-700 rounded-lg hover:bg-primary-50 transition-colors font-semibold"
                >
                  Starta om
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2.5 bg-white/10 text-white rounded-lg hover:bg-white/15 transition-colors border border-white/10"
                >
                  Stäng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
