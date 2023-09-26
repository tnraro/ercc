<script lang="ts">
  import { floating } from "./floating";
  let refs: HTMLElement[] = [];
  const placements = [
    "top",
    "right",
    "bottom",
    "left",
    "top-start",
    "right-start",
    "bottom-start",
    "left-start",
    "top-end",
    "right-end",
    "bottom-end",
    "left-end",
  ] as const;
</script>

<div class="container">
  <button bind:this={refs[0]}>a</button>
  <button bind:this={refs[1]}>a</button>
  <button bind:this={refs[2]}>a</button>
  <button bind:this={refs[3]}>a</button>
  <button bind:this={refs[4]}>a</button>
  <button bind:this={refs[5]}>a</button>
  <button bind:this={refs[6]}>a</button>
  <button bind:this={refs[7]}>a</button>
  <button bind:this={refs[8]}>a</button>
  <button bind:this={refs[9]}>a</button>
</div>
{#each refs as ref, i}
  <div
    use:floating={{
      target: ref,
      options: { placement: placements[i] },
      auto: true,
    }}
  >
    난 고수
  </div>
{/each}

<style>
  .container {
    position: absolute;
    top: 20%;
    left: 20%;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 15rem;
  }
  button {
    width: 100px;
    height: 100px;
  }
</style>
