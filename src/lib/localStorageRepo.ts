import type { Match, Player } from './domain';

const PLAYERS_KEY = 'players';
const MATCHES_KEY = 'matches';

export function savePlayers(players: Player[]): void {
	localStorage.setItem(PLAYERS_KEY, JSON.stringify(players));
}

export function loadPlayers(): Player[] {
	const stored = localStorage.getItem(PLAYERS_KEY);
	return stored ? JSON.parse(stored) : [];
}

export function saveMatches(players: Match[]): void {
	localStorage.setItem(MATCHES_KEY, JSON.stringify(players));
}

export function loadMatches(): Match[] {
	const stored = localStorage.getItem(MATCHES_KEY);
	return stored ? JSON.parse(stored) : [];
}

export function loadMatch(matchNo: number): Match | undefined {
	return loadMatches().find((match) => match.matchNo === matchNo);
}

export function deleteAllMatches(): void {
	localStorage.removeItem(MATCHES_KEY);
}

export function setScore(matchNo: number, score: [number, number]): void {
	const matches = loadMatches();
	const match = matches.find((match) => match.matchNo === matchNo);
	if (match) {
		match.score = score;
		console.log(match.score)
		// save changes
		saveMatches(matches);
	}
}