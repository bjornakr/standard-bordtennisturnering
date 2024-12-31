<script lang="ts">
	import { loadPlayers } from '$lib/localStorageRepo';
	import { roundrobinx } from '$lib/roundrobin';
	import type { Player } from '$lib/domain';

	const players: Player[] = loadPlayers();
	const matches = roundrobinx([...players]);
	console.log(matches);
</script>

<h1>Turnering</h1>

<table>
    <thead>
        <tr>
            <th>#</th>
            <th>Hjemme</th>
            <th>Borte</th>
            <th>Poengstilling</th>
            <th>Handlinger</th>
        </tr>
    </thead>
    <tbody>
        {#each matches as match, index}
            <tr>
                <td>{index + 1}</td> <!-- Match number -->
                <td>{match[0]}</td> <!-- Home player -->
                <td>{match[1]}</td> <!-- Away player -->
                <td>-</td> <!-- Placeholder for points -->
                <td><button>Spill kamp</button> <button>Sett resultat</button></td>
            </tr>
        {/each}
    </tbody>
</table>
