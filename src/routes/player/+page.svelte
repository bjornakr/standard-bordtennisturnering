<script lang="ts">
	import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { savePlayers } from '$lib/localStorageRepo';
	    import type { Player } from '$lib/domain'

	let inputField: HTMLInputElement;
	onMount(() => inputField.focus());

	const players: Player[] = $state([]);
	let newPlayerName = $state('');

	function newPlayerIsValid(): boolean {
		return newPlayerName.length > 0 && !players.map(ps => ps.name).includes(newPlayerName);
	}

	function canCreateTournament(): boolean {
		return players.length >= 2;
	}

	async function addPlayer(event: Event) {
		event.preventDefault();
		const avatar = ":-)";
		players.push({ name: newPlayerName, avatar: avatar });
		newPlayerName = '';
	}

	function deletePlayer(idx: number): void {
		players.splice(idx, 1);
	}

    function createTournament() {
        savePlayers(players); // Save players to localStorage
        goto('/tournament'); // Navigate to tournament index page
    }

</script>

<h1>Registrer spillere</h1>

<h2>Registrer ny spiller</h2>
<form onsubmit={addPlayer}>
	<input type="text" bind:value={newPlayerName} bind:this={inputField} required />
	<button type="submit" disabled={!newPlayerIsValid()}>Registrer</button>
</form>

<h2>Registrerte spillere</h2>
<ul>
	{#each players as p, idx}
		<li>
			{p}
			<button aria-label="Delete {p}" onclick={() => deletePlayer(idx)}>❌</button>
		</li>
		<li>{p.avatar}</li>
	{/each}
</ul>

<button disabled={!canCreateTournament()} onclick={() => createTournament()}>Opprett turnering</button>
