import roundrobin from 'roundrobin';
import type { Match, Player } from './domain';

export function roundrobinx(players: Player[]): Match[] {
    return roundrobin(players.length, players).flat()
}