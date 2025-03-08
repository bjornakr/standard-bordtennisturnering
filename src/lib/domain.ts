export type Player = {
	name: string;
	avatar: string; // SVG
};
export type Match = {
	matchNo: number;
	home: Player;
	away: Player;
	score: [number, number] | null;
};

export function createMatch(matchNo: number, home: Player, away: Player): Match {
	return { matchNo, home, away, score: null };
}

export const pointsToWin = 11;

export type Home = 'home';
export const HOME = 'home';
export type Away = 'away';
export const AWAY = 'away';
export type Side = Home | Away;

function flipSide(side: Side): Side {
	if (side === HOME) {
		return AWAY;
	} else {
		return HOME;
	}
}

export function calcServingSide(homeScore: number, awayScore: number, startingSide: Side): Side {
	const servesPerRound = 3;
	const totalScore = homeScore + awayScore;
	const flips = Math.floor(totalScore / servesPerRound);

	if (homeScore >= pointsToWin - 1 && awayScore >= pointsToWin - 1) {
		const flips = totalScore - 20;
		return flips % 2 === 0 ? startingSide : flipSide(startingSide);
	} else {
		return flips % 2 === 0 ? startingSide : flipSide(startingSide);
	}
}

export function hasServe(
	homeScore: number,
	awayScore: number,
	startingSide: Side,
	currentSide: Side
): boolean {
	return calcServingSide(homeScore, awayScore, startingSide) === currentSide;
}

export function calcWinner(homeScore: number, awayScore: number): Side | 'in-progress' {
	if (homeScore >= pointsToWin && homeScore - awayScore >= 2) {
		return HOME;
	} else if (awayScore >= pointsToWin && awayScore - homeScore >= 2) {
		return AWAY;
	} else {
		return 'in-progress';
	}
}

export function isWinner(homeScore: number, awayScore: number, side: Side): boolean {
	return calcWinner(homeScore, awayScore) === side;
}

export function isGameOver(homeScore: number, awayScore: number): boolean {
	return calcWinner(homeScore, awayScore) !== 'in-progress';
}

export function isValidFinalScore(homeScore: number, awayScore: number): boolean {
	const pointsToWin = 11;

	const scoreDifference = Math.abs(homeScore - awayScore);
	const maxPoints = Math.max(homeScore, awayScore);

	if (maxPoints >= pointsToWin && scoreDifference >= 2) {
		const minPointsRequiredToWin = Math.max(pointsToWin, Math.min(homeScore, awayScore) + 2);
		return maxPoints === minPointsRequiredToWin;
	}

	return false;
}

export function createNewRound(matches: Match[], playerCount: number): Match[] {
	const startOffset = matches.length + 1;
	const initialMatchCount = playerCount * (playerCount - 1) / 2;
	const initialMatches = matches.slice(0,initialMatchCount);
	const shouldFlipHomeAway = matches.length / initialMatchCount % 2 === 1;
	console.log(initialMatches);
	if (shouldFlipHomeAway) {
		return initialMatches.map((match, idx) => createMatch(startOffset + idx, match.away, match.home));
	}
	else {
		return initialMatches.map((match, idx) => createMatch(startOffset + idx, match.home, match.away));
	}
}
