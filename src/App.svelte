<script lang="ts">
  import PlayerState, {
    type PlayerStateOptions,
  } from "./comps/PlayerState.svelte";
  import BestCombinations from "./features/BestCombinations.svelte";
  import CompareValues from "./features/CompareValues.svelte";

  const enum Route {
    BestCombinations,
    CompareItemValues,
  }

  let route = Route.BestCombinations;
  let playerState: PlayerStateOptions = {
    character: undefined,
    weapon: undefined,
    weaponType: undefined,
    characterLevel: 6,
    weaponLevel: 3,
    targetDefense: 90,
  };
</script>

<nav>
  <button on:click={() => (route = Route.BestCombinations)}>
    Best Combinations
  </button>
  <button on:click={() => (route = Route.CompareItemValues)}>
    Compare Item Values
  </button>
</nav>
<main>
  <PlayerState
    bind:character={playerState.character}
    bind:weaponType={playerState.weaponType}
    bind:weapon={playerState.weapon}
    bind:characterLevel={playerState.characterLevel}
    bind:weaponLevel={playerState.weaponLevel}
    bind:targetDefense={playerState.targetDefense}
  />
  {#if route === Route.BestCombinations}
    <BestCombinations {playerState} />
  {:else if route === Route.CompareItemValues}
    <CompareValues {playerState} />
  {/if}
</main>
<footer>
  <h1>Disclaimer</h1>
  <p>본 계산기는 한정된 정보를 이용하여 주관적인 결과를 제공합니다.</p>
  <p>본 계산기는 정보의 완전성, 정확성, 적시성을 보증하지 않습니다.</p>
</footer>

<style>
  :root {
    font-family: sans-serif;
  }
  main {
    display: flex;
    flex-direction: column;
    gap: 32px;
    max-width: 640px;
    margin: 0 auto;
  }
  footer {
    max-width: 640px;
    margin: 0 auto;
    height: 100vh;
  }
</style>
