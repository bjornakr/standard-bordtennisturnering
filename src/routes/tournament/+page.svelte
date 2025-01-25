<script lang="ts">
    import {loadMatches, loadPlayers, saveMatches} from '$lib/localStorageRepo';
    import {createMatches} from '$lib/utils';
    import type {Player, Match} from '$lib/domain';
    import {goto} from "$app/navigation";

    const players: Player[] = loadPlayers();

    function getOrCreateMatches() {
        const storedMatches = loadMatches();
        if (storedMatches.length > 0)
            return storedMatches;
        else {
            const newMatches = createMatches(players)
            saveMatches(newMatches);
            return newMatches;
        }
    }

    const matches = getOrCreateMatches();

    type Stats = { wins: number, losses: number, x: number, y: number }
    type LeaderboardEntry = { playerName: string, stats: Stats }
    const emptyStats: Stats = { wins: 0, losses: 0, x: 0, y: 0 }
    // reduce(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T, initialValue: T): T;

    function compareStats(a: Stats, b: Stats): number {
        if (a.wins !== b.wins) {
            return b.wins - a.wins;
        }
        const diffA = a.x - a.y;
        const diffB = b.x - b.y;
        if (diffA !== diffB) {
            return diffB - diffA;
        }
        const totalA = a.wins + a.losses;
        const totalB = b.wins + b.losses;
        if (totalA !== totalB) {
            return totalB - totalA;
        }
        return 0;
}

    function getStats(playerName: string): Stats {
        return matches.reduce((acc: Stats, match: Match) => {
            let squeeze: [number, number] | null = null;
            if (match.home.name === playerName && match.score !== null) 
                    squeeze = match.score;
            else if (match.away.name === playerName && match.score !== null) 
                    squeeze = [match.score[1], match.score[0]];
            else 
                squeeze = null;

            if (squeeze === null)
                return acc;
            else 
                return { 
                    wins: squeeze[0] > squeeze[1] ? acc.wins + 1 : acc.wins,
                    losses: squeeze[1] > squeeze[0] ? acc.losses + 1 : acc.losses,
                    x: acc.x + squeeze[0],
                    y: acc.y + squeeze[1],
                }
            }, emptyStats)
    }

    function calcLeaderboard() {
        const entries: LeaderboardEntry[] = players.map(p => ({
            playerName: p.name,
            stats: getStats(p.name)
            }));
        return entries.sort((a, b) => compareStats(a.stats, b.stats));
    }

</script>

<h1>Turnering</h1>

<table>
    <thead>
    <tr>
        <th>#</th>
        <th>Hjemme</th>
        <th>Borte</th>
        <th>Resultat</th>
        <th></th>
    </tr>
    </thead>
    <tbody>
    {#each matches as match}
        <tr>
            <td>{match.matchNo}</td>
            <td>{match.home.name}</td>
            <td>{match.away.name}</td>
            <td>{match.score?.[0]}-{match.score?.[1]}</td>
            <td>
                <button onclick={() => goto(`match/${match.matchNo}`)}>✎</button>
            </td>
        </tr>
    {/each}
    </tbody>
</table>

<h2>Resultattavle</h2>

<table class="tiny">
    <thead>
    <tr>
        <th>#</th>
        <th>Spiller</th>
        <th>Kamper spilt</th>
        <th>Seire</th>
        <th>Tap</th>
        <th colspan="2">Målforskjell</th>
    </tr>
    </thead>
    <tbody>
    {#each calcLeaderboard() as entry, idx}
        <tr>
            <td>{idx+1}</td>
            <td>{entry.playerName}</td>
            <td>{entry.stats.wins + entry.stats.losses}</td>
            <td>{entry.stats.wins}</td>
            <td>{entry.stats.losses}</td>
            <td>{entry.stats.x}</td>
            <td>{entry.stats.y}</td>
        </tr>
    {/each}
    </tbody>
</table>
