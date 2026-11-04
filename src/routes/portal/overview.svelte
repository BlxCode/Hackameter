<script>
  import { hackatimeData } from "./main.svelte";

  function formatTime(seconds) {
    if (seconds == null || seconds === "") {
      return "No data available";
    }
    if (seconds === 0) {
      return "0h 0m 0s";
    }

    seconds = Number(seconds);

    if (!Number.isFinite(seconds)) {
      return "No data available";
    }

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  }

  let totalTime = $state(
    hackatimeData.simpleData.totalTime || "No data available",
  );
  let todayTime = $state(
    hackatimeData.simpleData.todayTime || "No data available",
  );
  let todayGoalTarget = $state(hackatimeData.simpleData.todayGoalTarget || 0);
  let todayGoalPercent = $state(0);
  $effect(() => {
    if (totalTime !== undefined && totalTime !== null) {
      console.log("Total Time in sidebar.svelte:", totalTime);
      if (hackatimeData.simpleData.totalTime) {
        const formattedTotalTime = formatTime(
          hackatimeData.simpleData.totalTime,
        );
        totalTime = formattedTotalTime;
      }

      if (hackatimeData.simpleData.todayTime !== undefined && hackatimeData.simpleData.todayTime !== null) {
        const formattedTodayTime = formatTime(
          hackatimeData.simpleData.todayTime,
        );
        todayTime = formattedTodayTime;
      }

      if (hackatimeData.simpleData.todayGoalTarget !== undefined && hackatimeData.simpleData.todayGoalTarget !== null) {
        const formattedTodayGoalTarget = formatTime(
          hackatimeData.simpleData.todayGoalTarget,
        );
        todayGoalTarget = formattedTodayGoalTarget;
      }

      if (
        hackatimeData.simpleData.todayTime !== undefined &&
        hackatimeData.simpleData.todayTime !== null &&
        hackatimeData.simpleData.todayGoalTarget !== undefined &&
        hackatimeData.simpleData.todayGoalTarget !== null
      ) {
        const percent =
          (hackatimeData.simpleData.todayTime /
            hackatimeData.simpleData.todayGoalTarget) *
          100;
        todayGoalPercent = percent.toFixed(2);
      }
    }
  });

  $inspect("Today's Time in sidebar.svelte:", todayTime);
</script>
<div style="display:flex; flex-direction: row; gap: 0.5rem; flex-wrap: wrap;">
  
<article>
  <p>Total Time</p>
  <strong>{totalTime || "No data available"}</strong>
</article>
<article>
  <p>Today's Time</p>
  <strong  >
  <span data-tooltip={todayGoalPercent + "% of goal achieved"}>
    {todayTime || "No data available"} /
    <small class="muted">{todayGoalTarget || "No data available"}</small> 
    </span><br />
    <progress style="margin: 0.5rem 0;" value={todayGoalPercent || 0} max="100"
  ></progress>
  </strong>
  
</article>
<article>
  <p>Current Streak</p>
  <strong>{hackatimeData.simpleData.streak || "No data available"}</strong>
</article>
</div>
<style>
  article{
    flex:1;
    vertical-align:middle;
    min-width: 15rem;
  }
</style>