<script>
  import "../layout.css";
  import "../pico.fluid.css"
  import STONKS from "#lib/assets/STONKS.png";

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={STONKS} />
  <title>HackaMeter Portal</title>
</svelte:head>
<svelte:body  />

{@render children()}

<style>
  * {
    text-align: center;
    font-family: "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif;
  }
  body {
    margin: 0;
    padding: 0;
    overflow: hidden;
  }
</style>
