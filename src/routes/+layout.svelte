<script>
  import "./layout.css";
  import STONKS from "#lib/assets/STONKS.png";
  import "./pico.fluid.css";

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={STONKS} />
  <title>HackaMeter</title>
</svelte:head>
<svelte:body />
{@render children()}

<style>
  * {
    text-align: center;
    font-family: "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif;
  }
</style>
