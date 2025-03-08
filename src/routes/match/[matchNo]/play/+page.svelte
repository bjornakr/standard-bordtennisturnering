<script lang="ts">
	import { page } from '$app/state';
	import { loadMatch, setScore } from '$lib/localStorageRepo';
	import { goto } from '$app/navigation';
	import type { Side } from '$lib/domain';
	import { HOME, AWAY } from '$lib/domain';
	import * as Lib from '$lib/domain';

	const matchNo = Number(page.params.matchNo);
	const match = loadMatch(matchNo);
	if (!match) {
		throw new Error(`match not found for matchNo: ${matchNo}`);
	}

	type Serve = 'serve';
	const SERVE = 'serve';
	type Point = 'point';
	const POINT = 'point';
	type Event = [Serve, Side] | [Point, Side]
	const events: Event[] = $state([]);

	let homeScore = $derived(calcScore(HOME));
	let awayScore = $derived(calcScore(AWAY));

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

	function hasServe(currentSide: Side): boolean {
		const serveEvent = (events.find(([t, _]) => t === SERVE));
		if (!serveEvent) {
			return false;
		}
		return Lib.hasServe(homeScore, awayScore, serveEvent[1], currentSide);
	}

	function isWinner(side: Side): boolean {
		return Lib.isWinner(homeScore, awayScore, side);
	}

	function isGameOver(): boolean {
		return Lib.isGameOver(homeScore, awayScore);
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

	function save() {
		if (!isGameOver()) {
			return;
		}
		const score: [number, number] = [homeScore, awayScore];
		setScore(match.matchNo, score);
		goto(`../${matchNo}`);
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
			<div class="serve"></div>
		{:else if hasServe(HOME)}
			<div class="serve">🏓</div>
		{:else}
			<div class="serve" style="filter: grayscale(100%); opacity: 0.4;">🏓</div>
		{/if}
		<div class="score">{homeScore}</div>
		<button class="button-19" disabled={isGameOver()} onclick={() => scoreButtonClicked("home")}>{ scoreButtonText() }</button>
	</div>
	<div class="vs">vs</div>
	<div class="player away">
		<div class="name">{match.away.name}</div>
		<div class="avatar">{@html match.away.avatar}</div>
		{#if isWinner(AWAY)}
			<div class="serve">🏆</div>
		{:else if isWinner(HOME)}
			<div class="serve"></div>
		{:else if hasServe(AWAY)}
			<div class="serve">🏓</div>
		{:else}
			<div class="serve" style="filter: grayscale(100%); opacity: 0.4;">🏓</div>
		{/if}
		<div class="score">{awayScore}</div>
		<button class="button-19" disabled={isGameOver()}
						onclick={() => scoreButtonClicked("away")}>{ scoreButtonText() }</button>

	</div>
</div>

<div class="actions">
	<button onclick={() => undo()}>Angre</button>
	<button onclick={() => goto(`../${match.matchNo}`)}>Avbryt</button>
	<button disabled={!isGameOver()} onclick={() => save()}>Lagre resultat</button>
</div>

<h2>Kampens utvikling</h2>
<ul>
	{#each events as [event, side], i}
		<li>{i + 1}: {event} - {side}</li>
	{/each}
</ul>

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

    .custom-button {
        display: inline-block;
        padding: 12px 24px;
        font-size: 16px;
        font-weight: bold;
        text-transform: uppercase;
        color: #fff;
        background: linear-gradient(135deg, #007aff, #0051a8);
        border: none;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
        cursor: pointer;
        transition: all 0.3s ease-in-out;
    }

    .custom-button:hover {
        background: linear-gradient(135deg, #0051a8, #007aff);
        transform: translateY(-2px);
        box-shadow: 0 6px 10px rgba(0, 0, 0, 0.3);
    }

    .custom-button:active {
        transform: translateY(1px);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }


    /* CSS */
    .button-19 {
        appearance: button;
        background-color: #1899D6;
        border: solid transparent;
        border-radius: 16px;
        border-width: 0 0 4px;
        box-sizing: border-box;
        color: #FFFFFF;
        cursor: pointer;
        display: inline-block;
        font-family: din-round, sans-serif;
        font-size: 15px;
        font-weight: 700;
        letter-spacing: .8px;
        line-height: 20px;
        margin: 0;
        outline: none;
        overflow: visible;
        padding: 13px 16px;
        text-align: center;
        text-transform: uppercase;
        touch-action: manipulation;
        transform: translateZ(0);
        transition: filter .2s;
        user-select: none;
        -webkit-user-select: none;
        vertical-align: middle;
        white-space: nowrap;
        width: 100%;
    }

    .button-19:after {
        background-clip: padding-box;
        background-color: #1CB0F6;
        border: solid transparent;
        border-radius: 16px;
        border-width: 0 0 4px;
        bottom: -4px;
        content: "";
        left: 0;
        position: absolute;
        right: 0;
        top: 0;
        z-index: -1;
    }

    .button-19,
    .button-19:focus {
        user-select: auto;
    }

    .button-19:hover:not(:disabled) {
        filter: brightness(1.1);
        -webkit-filter: brightness(1.1);
    }

    .button-19:disabled {
        cursor: auto;
    }

    .button-19:active {
        border-width: 4px 0 0;
        background: none;
    }

</style>

