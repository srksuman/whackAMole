/** @format */

export type GameState = "setup" | "playing" | "finished" | "leaderboard";
export type LeaderboardEntry = { name: string; score: number; time: number; country: string };
export type HoleState = "normal" | "hit" | "miss";
