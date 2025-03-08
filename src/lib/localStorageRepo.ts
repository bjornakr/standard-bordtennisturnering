import type { Match, Player } from './domain';

const PLAYERS_KEY = 'players';
const MATCHES_KEY = 'matches';

type PlayerId = string;

type PlayerDb = {
	id: PlayerId,
	avatarSvg: string,
}

function toPlayerDb(player: Player): PlayerDb {
	return {
		id: player.name,
		avatarSvg: player.avatar,
	};
}

function toPlayer(playerDb: PlayerDb): Player {
	return {
		name: playerDb.id,
		avatar: playerDb.avatarSvg,
	};
}

type MatchDb = {
	matchNo: number;
	home: PlayerId;
	away: PlayerId;
	score: [number, number] | null;
}

function toMatchDb(match: Match): MatchDb {
	return {
		matchNo: match.matchNo,
		home: match.home.name,
		away: match.away.name,
		score: match.score,
	};
}

function toMatch(matchDb: MatchDb, players: Player[]): Match {
	const home = players.find(p => p.name === matchDb.home);
	const away = players.find(p => p.name === matchDb.away);
	if (!home || !away) {
		throw new Error(`player(s) not found for match: ${matchDb}`);
	}
	return {
		matchNo: matchDb.matchNo,
		home: home,
		away: away,
		score: matchDb.score,
	};
}

export function savePlayers(players: Player[]): void {
	const playersDb = players.map(toPlayerDb);
	localStorage.setItem(PLAYERS_KEY, JSON.stringify(playersDb));
}

export function loadPlayers(): Player[] {
	const playersDbRaw = localStorage.getItem(PLAYERS_KEY);
	if (playersDbRaw === null) {
		return [];
	}
	const playersDb = JSON.parse(playersDbRaw);
	return playersDb.map(toPlayer);
}

export function saveMatches(matches: Match[]): void {
	const matchesDb = matches.map(toMatchDb);
	localStorage.setItem(MATCHES_KEY, JSON.stringify(matchesDb));
}

export function loadMatches(): Match[] {
	const players = loadPlayers();
	const matchesDbRaw = localStorage.getItem(MATCHES_KEY);

	if (matchesDbRaw === null) {
		return [];
	}
	const matchesDb = JSON.parse(matchesDbRaw)
	return matchesDb.map((m: MatchDb) => toMatch(m, players))
}

export function loadMatch(matchNo: number): Match | undefined {
	return loadMatches().find((match) => match.matchNo === matchNo);
}

export function getMatchesForPlayer(id: PlayerId): Match[] {
	return loadMatches().filter((match) => match.home.name === id || match.away.name === id);
}

export function deleteAllMatches(): void {
	localStorage.removeItem(MATCHES_KEY);
}

export function setScore(matchNo: number, score: [number, number]): void {
	const matches = loadMatches();
	const match = matches.find((match) => match.matchNo === matchNo);
	if (match) {
		match.score = score;
		saveMatches(matches);
	}
}