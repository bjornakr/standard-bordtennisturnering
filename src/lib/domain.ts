export type Player = {
    name: string;
    avatar: string; // SVG
}
export type Match = {
    matchNo: number;
    home: Player;
    away: Player;
}

export function createMatch(matchNo: number, home: Player, away: Player): Match {
    return { matchNo, home, away };
}