import type { Player } from "./domain";

const PLAYERS_KEY = 'players';

export function savePlayers(players: Player[]): void {
    localStorage.setItem(PLAYERS_KEY, JSON.stringify(players));
}

export function loadPlayers(): Player[] {
    const stored = localStorage.getItem(PLAYERS_KEY);
    return stored ? JSON.parse(stored) : [];
}