<script>
  import { hackatimeData } from "./main.svelte";
  let bigGoals = $state(false);
  if (hackatimeData.customData && hackatimeData.customData.bigGoals) {
    bigGoals = true;
  } else {
  }
</script>



<div
  style="display:block; flex-direction: row; gap: 0.5rem; flex-wrap: wrap;margin:1rem; text-align:center; height:100%;"
>
  <div
    style="display:block; padding:1rem; text-align:center; width:100%; padding-left:2rem; padding-right:2rem;"
  >
    <h2>Big Goals</h2>
    <br />
    <p>
      Big Goals are a way to set long-term goals for yourself, and your
      projects. They are ment to be challenging, ambitious, but achievable. They
      are a way to push yourself to achieve more than what you thought was
      possible. Once you complete a Big Goal, you will be awarded with points,
      and a badge provided this is your first time completing one.
    </p>
  </div>
  <!--- IF THERE ARE BIG GOALS --->
  <div
    style="display:block; padding:1rem; text-align:center; width:100%; padding-left:2rem; padding-right:2rem;"
  >
    {#if bigGoals}
      <article><h3>Current Big Goals</h3></article>
    {:else}
      <article>
        <h3>There are no Big Goals yet.</h3>
        <p>Create a new Big Goal to get started.</p>
        <button>Create Big Goal</button>
      </article>
    {/if}
  </div>
</div>

<style>
  article {
    flex: 1;
    vertical-align: middle;
    min-width: 15rem;
    width: 80%;
    margin: auto;
  }
  .row {
    text-align: center;
    justify-content: center;
    padding-left: 1.25rem;
    padding-right: 1.25rem;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
</style>
