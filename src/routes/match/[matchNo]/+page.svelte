<script>
	import { page } from '$app/state';
	import { loadMatch } from '$lib/localStorageRepo';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';

	const matchNo = Number(page.params.matchNo);
	const match = loadMatch(matchNo);
	if (!match) {
		throw new Error(`Match not found for matchNo: ${matchNo}`);
	}

	let homeScore = match.score?.[0] ?? 0;
	let awayScore = match.score?.[1] ?? 0;
</script>

<h1>Kamp {matchNo}</h1>

<div class="match-container">
	<div class="player home">
		<div class="name">{match.home.name}</div>
		<div class="avatar">{@html match.home.avatar}</div>
		<div class="score">{homeScore}</div>
	</div>
	<div class="vs">vs</div>
	<div class="player away">
		<div class="name">{match.away.name}</div>
		<div class="avatar">{@html match.away.avatar}</div>
		<div class="score">{awayScore}</div>
	</div>
</div>

<div class="actions">
	<button onclick={() => goto(`${matchNo}/play`)}>Spill kamp</button>
	<button onclick={() => goto(`${matchNo}/score`)}>Sett resultat</button>
	<button onclick={() => goto(`${base}/tournament`)}>Gå tilbake til turneringsoversikt</button>
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

