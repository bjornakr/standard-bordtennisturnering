<script lang="ts">
	import { page } from '$app/state';
	import { loadMatch, setScore } from '$lib/localStorageRepo';
	import { goto } from '$app/navigation';
	import { isValidFinalScore } from '$lib/domain';

	const matchNo = Number(page.params.matchNo);
	const match = loadMatch(matchNo);
	if (!match) {
		throw new Error(`Match not found for matchNo: ${matchNo}`);
	}

	let homeScore = $state(match.score?.[0]);
	let awayScore = $state(match.score?.[1]);

	function getValidScore(): [number, number] | null {
		if (isValidFinalScore(homeScore ?? 0, awayScore ?? 0))
			return [homeScore ?? 0, awayScore ?? 0];
		else
			return null;
	}

	let isValidScore = $derived(isValidFinalScore(homeScore ?? 0, awayScore ?? 0))

	function save() {
		const score = getValidScore();
		if (!score) return;
		setScore(match.matchNo, score);
		goto(`../${matchNo}`);
	}
</script>

<h1>Kamp {matchNo}</h1>

<div class="match-container">
	<div class="player home">
		<div class="name">{match.home.name}</div>
		<div class="avatar">{@html match.home.avatar}</div>
		<input class="score" type="number" placeholder="0" bind:value={homeScore}/>
	</div>
	<div class="vs">vs</div>
	<div class="player away">
		<div class="name">{match.away.name}</div>
		<div class="avatar">{@html match.away.avatar}</div>
		<input class="score" type="number" placeholder="0" bind:value={awayScore}/>
	</div>
</div>

{#if isValidScore}
	<p>Valid score</p>
{:else}
	<p>Invalid score</p>
{/if}


<div class="actions">
	<button onclick={() => goto(`../${matchNo}`)}>Avbryt</button>
	<button disabled={!isValidScore} onclick={() => save()}>Lagre resultat</button>
</div>

<style>
    h1 {
        text-align: center;
        margin-bottom: 20px;
    }

    .match-container {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 16px;
        margin-bottom: 20px;
    }

    .player {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
    }

    .name {
        font-weight: bold;
        margin-bottom: 8px;
    }

    .avatar {
        width: 100px;
        height: 100px;
        margin-bottom: 8px;
    }

    /*.avatar svg {*/
    /*    width: 100%;*/
    /*    height: 100%;*/
    /*}*/

    .score {
        font-size: 48px;
        font-weight: bold;
        width: 3ch;
        text-align: center;
    }

    .vs {
        font-size: 24px;
        font-weight: bold;
    }

    .actions {
        text-align: center;
        margin-top: 20px;
    }

</style>

