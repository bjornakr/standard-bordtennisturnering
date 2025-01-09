<script>
    import {page} from '$app/state';
    import {loadMatch} from "$lib/localStorageRepo";
    import {goto} from "$app/navigation";

    const matchNo = Number(page.params.matchNo); // Get match number from the URL
    const match = loadMatch(matchNo);
    if (!match) {
        throw new Error(`Match not found for matchNo: ${matchNo}`);
    }

    let homeScore = 0;
    let awayScore = 0;
</script>

<h1>Kamp {matchNo}</h1>

<div class="match-container">
    <div class="player home">
        <div class="name">{match.home.name}</div>
        <div class="avatar">{@html match.home.avatar}</div>

        <input type="number" bind:value={homeScore} min="0"/>
    </div>
    <div class="vs">vs</div>
    <div class="player away">
        <div class="name">{match.away.name}</div>
        <div class="avatar">{@html match.away.avatar}</div>
        <input type="number" bind:value={awayScore} min="0"/>
    </div>
</div>

<div class="actions">
    <button>Spill kamp</button>
    <button>Sett resultat</button>
    <button onclick={() => goto("/tournament")}>Gå tilbake til turneringsoversikt</button>
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

    .avatar svg {
        width: 100%;
        height: 100%;
    }

    input[type="number"] {
        width: 50px;
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

    .actions button {
        margin: 0 8px;
        padding: 8px 16px;
        font-size: 16px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        background-color: #007bff;
        color: white;
    }

    .actions button:hover {
        background-color: #0056b3;
    }

    .actions button:active {
        background-color: #004494;
    }
</style>

