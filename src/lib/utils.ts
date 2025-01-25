import roundrobin from 'roundrobin';
import { createMatch, type Match, type Player } from './domain';

export function createMatches(players: Player[]): Match[] {
    return roundrobin(players.length, players.map(p => p.name))
        .flat()
        .map((playerNames, idx) => {
            const home = players.find(p => p.name === playerNames[0]);
            const away = players.find(p => p.name === playerNames[1]);
            if (!home || !away) {
                throw new Error(`player not found for names: ${playerNames}, players: ${players.map(p => p.name)}`);
            }
            return createMatch(idx + 1, home, away);
        })
}