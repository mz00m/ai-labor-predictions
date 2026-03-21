"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/**
 * 404 Page: "Lost in the Labor Market" Mini-Game
 *
 * A tiny worker character stands on a platform of job title tiles.
 * Tiles slowly disappear (automate away) and the character jumps
 * between remaining tiles. Land on the glowing "AI-complementary" tile to win.
 *
 * Controls: Arrow keys or click/tap on tiles to jump.
 */

interface Tile {
  id: number;
  x: number;
  y: number;
  width: number;
  label: string;
  alive: boolean;
  dying: boolean;
  isGoal: boolean;
  color: string;
}

const JOB_TITLES = [
  "Data Entry", "Bookkeeper", "Telemarketer", "Cashier",
  "File Clerk", "Typist", "Travel Agent", "Copy Editor",
  "Paralegal", "Tax Preparer", "Loan Officer",
];

const GOAL_TITLE = "AI Strategist";

const TILE_COLORS = [
  "#94a3b8", "#a1a1aa", "#9ca3af", "#a3a3a3", "#9e9e9e",
  "#8b8b8b", "#a0a0a0", "#b0b0b0", "#959595", "#aaa", "#999",
];

function createTiles(): Tile[] {
  const tiles: Tile[] = [];
  const cols = 4;
  const rows = 3;
  const tileW = 90;
  const gap = 10;
  const startX = 20;
  const startY = 100;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const idx = r * cols + c;
      if (idx >= JOB_TITLES.length) break;
      tiles.push({
        id: idx,
        x: startX + c * (tileW + gap),
        y: startY + r * 50,
        width: tileW,
        label: JOB_TITLES[idx],
        alive: true,
        dying: false,
        isGoal: false,
        color: TILE_COLORS[idx % TILE_COLORS.length],
      });
    }
  }

  // Add the goal tile (glowing, always at bottom-right)
  tiles.push({
    id: tiles.length,
    x: startX + 3 * (tileW + gap),
    y: startY + 2 * 50,
    width: tileW,
    label: GOAL_TITLE,
    alive: true,
    dying: false,
    isGoal: true,
    color: "#5C61F6",
  });

  return tiles;
}

export default function NotFoundGame() {
  const [tiles, setTiles] = useState<Tile[]>(createTiles);
  const [playerPos, setPlayerPos] = useState({ x: 65, y: 80 });
  const [playerTile, setPlayerTile] = useState(0);
  const [jumping, setJumping] = useState(false);
  const [won, setWon] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [reskillTitle, setReskillTitle] = useState(JOB_TITLES[0]);
  const timerRef = useRef<ReturnType<typeof setInterval>>();
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  // Auto-remove tiles over time
  useEffect(() => {
    if (won || gameOver) return;

    timerRef.current = setInterval(() => {
      setTiles((prev) => {
        const aliveTiles = prev.filter((t) => t.alive && !t.isGoal);
        if (aliveTiles.length <= 2) return prev;

        // Pick a random tile to start dying
        const victim = aliveTiles[Math.floor(Math.random() * aliveTiles.length)];
        return prev.map((t) =>
          t.id === victim.id ? { ...t, dying: true } : t
        );
      });

      // Actually remove dying tiles after animation
      setTimeout(() => {
        setTiles((prev) =>
          prev.map((t) => (t.dying ? { ...t, alive: false, dying: false } : t))
        );
      }, reducedMotion ? 0 : 600);
    }, 2500);

    return () => clearInterval(timerRef.current);
  }, [won, gameOver, reducedMotion]);

  // Check if player is on a dead tile
  useEffect(() => {
    const currentTile = tiles.find((t) => t.id === playerTile);
    if (currentTile && !currentTile.alive && !won) {
      setGameOver(true);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [tiles, playerTile, won]);

  const jumpToTile = useCallback(
    (tileId: number) => {
      if (jumping || won || gameOver) return;
      const target = tiles.find((t) => t.id === tileId && t.alive);
      if (!target) return;

      setJumping(true);
      setScore((s) => s + 1);

      // Update reskill title
      setReskillTitle(target.label);

      // Animate jump
      const midY = Math.min(playerPos.y, target.y) - 30;
      setPlayerPos({ x: target.x + target.width / 2, y: midY });

      setTimeout(() => {
        setPlayerPos({ x: target.x + target.width / 2, y: target.y - 20 });
        setPlayerTile(tileId);
        setJumping(false);

        if (target.isGoal) {
          setWon(true);
          if (timerRef.current) clearInterval(timerRef.current);
        }
      }, reducedMotion ? 0 : 200);
    },
    [jumping, won, gameOver, tiles, playerPos, reducedMotion]
  );

  // Keyboard controls
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (won || gameOver) return;
      const alive = tiles.filter((t) => t.alive);
      const current = tiles.find((t) => t.id === playerTile);
      if (!current) return;

      let target: Tile | undefined;
      if (e.key === "ArrowRight") {
        target = alive.find((t) => t.x > current.x && Math.abs(t.y - current.y) < 60);
      } else if (e.key === "ArrowLeft") {
        target = [...alive].reverse().find((t) => t.x < current.x && Math.abs(t.y - current.y) < 60);
      } else if (e.key === "ArrowDown") {
        target = alive.find((t) => t.y > current.y && Math.abs(t.x - current.x) < 110);
      } else if (e.key === "ArrowUp") {
        target = [...alive].reverse().find((t) => t.y < current.y && Math.abs(t.x - current.x) < 110);
      }
      if (target) jumpToTile(target.id);
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [tiles, playerTile, jumpToTile, won, gameOver]);

  const restart = () => {
    setTiles(createTiles());
    setPlayerPos({ x: 65, y: 80 });
    setPlayerTile(0);
    setJumping(false);
    setWon(false);
    setGameOver(false);
    setScore(0);
    setReskillTitle(JOB_TITLES[0]);
  };

  return (
    <div className="select-none" aria-label="Lost in the Labor Market mini-game">
      {/* Game canvas */}
      <svg
        viewBox="0 0 430 280"
        className="w-full max-w-md h-auto"
        style={{ touchAction: "none" }}
      >
        {/* Background grid */}
        {[0, 50, 100, 150, 200, 250].map((y) => (
          <line key={y} x1="0" y1={y} x2="430" y2={y} stroke="rgba(0,0,0,0.03)" />
        ))}

        {/* Tiles */}
        {tiles.map((tile) => {
          if (!tile.alive && !tile.dying) return null;
          return (
            <g
              key={tile.id}
              onClick={() => jumpToTile(tile.id)}
              className="cursor-pointer"
              style={{
                opacity: tile.dying ? 0 : tile.alive ? 1 : 0,
                transform: tile.dying ? "translateY(20px)" : "none",
                transition: reducedMotion ? "none" : "all 0.5s ease-in",
              }}
            >
              <rect
                x={tile.x}
                y={tile.y}
                width={tile.width}
                height={30}
                rx={6}
                fill={tile.isGoal ? tile.color : tile.color}
                stroke={tile.isGoal ? "#5C61F6" : "rgba(0,0,0,0.1)"}
                strokeWidth={tile.isGoal ? 2 : 0.5}
                opacity={tile.dying ? 0.3 : 0.9}
              />
              {tile.isGoal && !reducedMotion && (
                <rect
                  x={tile.x}
                  y={tile.y}
                  width={tile.width}
                  height={30}
                  rx={6}
                  fill="none"
                  stroke="#5C61F6"
                  strokeWidth={2}
                  opacity={0.5}
                >
                  <animate
                    attributeName="opacity"
                    values="0.5;0.1;0.5"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </rect>
              )}
              <text
                x={tile.x + tile.width / 2}
                y={tile.y + 18}
                textAnchor="middle"
                fill={tile.isGoal ? "white" : "white"}
                fontSize="9"
                fontWeight="600"
              >
                {tile.label}
              </text>
              {tile.dying && (
                <text
                  x={tile.x + tile.width / 2}
                  y={tile.y + 45}
                  textAnchor="middle"
                  fill="#ef4444"
                  fontSize="8"
                  fontWeight="500"
                  opacity={0.7}
                >
                  automated
                </text>
              )}
            </g>
          );
        })}

        {/* Player character */}
        <g
          style={{
            transform: `translate(${playerPos.x - 10}px, ${playerPos.y - 20}px)`,
            transition: reducedMotion ? "none" : `transform ${jumping ? 0.15 : 0.3}s cubic-bezier(0.34,1.56,0.64,1)`,
          }}
        >
          {/* Body */}
          <rect x="4" y="6" width="12" height="10" rx="2" fill="#5C61F6" />
          {/* Head */}
          <circle cx="10" cy="3" r="4" fill="#FFD4B8" />
          {/* Eyes */}
          <circle cx="8.5" cy="2.5" r="0.8" fill="#1a1a1a" />
          <circle cx="11.5" cy="2.5" r="0.8" fill="#1a1a1a" />
          {/* Legs */}
          <rect x="5" y="16" width="3" height="5" rx="1" fill="#374151" />
          <rect x="12" y="16" width="3" height="5" rx="1" fill="#374151" />
          {/* Label */}
          <text
            x="10"
            y="-3"
            textAnchor="middle"
            fill="var(--accent)"
            fontSize="7"
            fontWeight="600"
          >
            {reskillTitle}
          </text>
        </g>

        {/* Win celebration */}
        {won && (
          <g>
            <text x="215" y="35" textAnchor="middle" fill="#5C61F6" fontSize="18" fontWeight="800">
              Reskilled!
            </text>
            <text x="215" y="55" textAnchor="middle" fill="var(--muted)" fontSize="10">
              {score} jumps to find an AI-complementary role
            </text>
          </g>
        )}

        {/* Game over */}
        {gameOver && !won && (
          <g>
            <text x="215" y="35" textAnchor="middle" fill="#ef4444" fontSize="16" fontWeight="800">
              Displaced!
            </text>
            <text x="215" y="52" textAnchor="middle" fill="var(--muted)" fontSize="10">
              Your tile was automated. Jump faster next time.
            </text>
          </g>
        )}
      </svg>

      {/* Controls hint */}
      <div className="flex items-center justify-between mt-2 text-[10px] text-[var(--muted)]">
        <span>Arrow keys or click tiles to jump</span>
        {(won || gameOver) && (
          <button
            onClick={restart}
            className="text-[var(--accent)] font-medium hover:underline"
          >
            Play again
          </button>
        )}
      </div>
    </div>
  );
}
