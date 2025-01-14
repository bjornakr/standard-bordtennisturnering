<script lang="ts">
	import { page } from '$app/state';
	import { loadMatch } from '$lib/localStorageRepo';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';

	const matchNo = Number(page.params.matchNo);
	const match = loadMatch(matchNo);
	if (!match) {
		throw new Error(`match not found for matchNo: ${matchNo}`);
	}

	const initScoreLimit = 11;

	type Home = "home";
	const HOME = "home";
	type Away = "away";
	const AWAY = "away";
	type Side = Home | Away;
	type Serve = "serve";
	const SERVE = "serve"
	type Point = "point";
	const POINT = "point"
	type Event = [Serve, Side] | [Point, Side]
	const events: [Event] = $state([]);

	// type Serve = "home" | "away" | 'unassigned';
	//
	// let serve: Serve = $state('unassigned');
	let homeScore = $derived(calcScore(HOME));
	let awayScore = $derived(calcScore(AWAY));

	// let homeServe = $derived(hasServe("home"));
	// let awayServe = $derived(hasServe("away"));



	function calcScore(side: Side) {
		return events.filter(([t, s]) => t === POINT && s === side).length;
	}

	function scoreButtonText() {
		if (events.length === 0) {
			return 'Gi serve';
		} else {
			return 'Gi poeng';
		}
	}

	function flipSide(side: Side): Side {
		if (side === HOME) {
			return AWAY;
		} else {
			return HOME;
		}
	}

	function calcServingSide(): Side | "undecided" {
		const servesPerRound = 3;
		const serveEventCount = 1;
		const totalScore = homeScore + awayScore;
		// const flips = Math.floor((events.length - serveEventCount) / servesPerRound);
		const flips = Math.floor(totalScore / servesPerRound);

		const serveEvent = (events.find(([t, _]) => t === SERVE));
		if (!serveEvent) {
			return "undecided"
		}
		const firstServeSide = serveEvent[1];

		if (homeScore >= (initScoreLimit - 1) && awayScore >= (initScoreLimit - 1)) {
			const flips = totalScore - 20;
			return flips % 2 === 0 ? firstServeSide : flipSide(firstServeSide);
		}
		else {
			return flips % 2 === 0 ? firstServeSide : flipSide(firstServeSide);
		}
	}

	function hasServe(side: Side): boolean {
		return calcServingSide() === side;
	}

	function calcWinner(): Side | "in-progress" {
		if (homeScore >= initScoreLimit && homeScore - awayScore >= 2) {
			return HOME;
		}
		else if (awayScore >= initScoreLimit && awayScore - homeScore >= 2) {
			return AWAY;
		}
		else {
			return 'in-progress'
		}
	}

	function isWinner(side: Side): boolean {
		return calcWinner() === side;
	}

	function isGameOver(): boolean {
		return calcWinner() !== 'in-progress';
	}

	function scoreButtonClicked(side: Side) {
		if (isGameOver()) {
			// do nothing
		} else if (events.length === 0) {
	    events.push([SERVE, side]);
	  } else {
	    events.push([POINT, side]);
	  }
	}

	function undo() {
		events.pop();
	}
</script>

<h1>Kamp #{matchNo}</h1>

<div class="match-container">
	<div class="player home">
		<div class="name">{match.home.name}</div>
		<div class="avatar">{@html match.home.avatar}</div>
		{#if isWinner(HOME)}
			<div class="serve">🏆</div>
		{:else if isWinner(AWAY)}
				<div class="serve"> </div>
		{:else if hasServe(HOME)}
			<div class="serve">🏓</div>
		{:else}
			<div class="serve" style="filter: grayscale(100%); opacity: 0.4;">🏓</div>
		{/if}
		<div class="score">{homeScore}</div>
		<button disabled={isGameOver()} onclick={() => scoreButtonClicked("home")}>{ scoreButtonText() }</button>
	</div>
	<div class="vs">vs</div>
	<div class="player away">
		<div class="name">{match.away.name}</div>
		<div class="avatar">{@html match.away.avatar}</div>
		{#if isWinner(AWAY)}
			<div class="serve">🏆</div>
		{:else if isWinner(HOME)}
			<div class="serve"> </div>
		{:else if hasServe(AWAY)}
			<div class="serve">🏓</div>
		{:else}
			<div class="serve" style="filter: grayscale(100%); opacity: 0.4;">🏓</div>
		{/if}
		<div class="score">{awayScore}</div>
		<button disabled={isGameOver()} onclick={() => scoreButtonClicked("away")}>{ scoreButtonText() }</button>

	</div>
</div>
<button onclick={() => undo()}>Angre</button>

<div class="actions">
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
        gap: 8px;
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

    .serve {
        height: 38px;
        font-size: 32px;
    }

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

