<script lang="ts">
  import Icon from "./icons.svg";
  export let as: "map";
</script>

<svg><use href="{Icon}#{as}" /></svg>

<style>
  svg {
    width: 24px;
    height: 24px;
    fill: none;
    stroke: currentColor;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
</style>
