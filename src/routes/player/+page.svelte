<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { createAvatar } from '@dicebear/core';
	import { avataaars } from '@dicebear/collection';
	import {deleteAllMatches, savePlayers} from '$lib/localStorageRepo';
	import type { Player } from '$lib/domain';

	let inputField: HTMLInputElement;
	onMount(() => inputField.focus());

	const players: Player[] = $state([]);
	let newPlayerName = $state('');

	function newPlayerIsValid(): boolean {
		return newPlayerName.length > 0 && !players.map((ps) => ps.name).includes(newPlayerName);
	}

	function canCreateTournament(): boolean {
		return players.length >= 2;
	}

	async function addPlayer(event: Event) {
		event.preventDefault();
		const avatar = createAvatar(avataaars, {
			seed: newPlayerName
		});
		players.push({ name: newPlayerName, avatar: avatar.toString() });
		newPlayerName = '';
	}

	function deletePlayer(idx: number): void {
		players.splice(idx, 1);
	}

	function createTournament() {
		savePlayers(players); // Save players to localStorage
		deleteAllMatches();
		goto(`tournament`); // Navigate to tournament index page
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
			<span class="avatar">{@html p.avatar}</span>
			{p.name}
			<button aria-label="Delete {p.name}" onclick={() => deletePlayer(idx)}>❌</button>
		</li>
	{/each}
</ul>

<button disabled={!canCreateTournament()} onclick={() => createTournament()}
	>Opprett turnering</button
>

<style>
	ul {
		list-style: none;
		padding: 0;
	}
	li {
        display: flex;
        align-items: center;
		gap: 8px;
	}

	.avatar {
        width: 40px;
        height: 40px;
        display: inline-block;
    }
</style>
