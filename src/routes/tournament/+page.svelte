<script lang="ts">
    import {loadMatches, loadPlayers, saveMatches} from '$lib/localStorageRepo';
    import {createMatches} from '$lib/utils';
    import type {Player} from '$lib/domain';
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
    console.log(matches);
    // const matches = roundrobinx([...players]);
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
