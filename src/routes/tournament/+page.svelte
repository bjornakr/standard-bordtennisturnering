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
            <th></th>
        </tr>
    </thead>
    <tbody>
        {#each matches as match, index}
            <tr>
                <td>{index + 1}</td>
                <td>{match[0]}</td>
                <td>{match[1]}</td>
                <td>-</td>
                <td>
                    <button>📝</button> 
                    <!-- <button>Sett resultat</button>
                    <button>Slett resultat</button> -->
                </td>
            </tr>
        {/each}
    </tbody>
</table>
