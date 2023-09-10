<script lang="ts">
    import BestCombinations from "./features/BestCombinations.svelte";

</script>

<main>
  <BestCombinations />
</main>
<footer>
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
