<script lang="ts">
  import ProbabilityDistribution from "./lib/ProbabilityDistribution.svelte";
</script>

<main>
  <ProbabilityDistribution />
</main>

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
</style>
