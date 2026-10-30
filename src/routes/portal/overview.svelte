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
  $effect(() => {
    if (
      hackatimeData.simpleData.totalTime &&
      !totalTime.includes("h") &&
      !totalTime.includes("m") &&
      !totalTime.includes("s")
    ) {
      const formattedTotalTime = formatTime(hackatimeData.simpleData.totalTime);
      totalTime = formattedTotalTime;
    }

    if (
      hackatimeData.simpleData.todayTime &&
      !todayTime.includes("h") &&
      !todayTime.includes("m") &&
      !todayTime.includes("s")
    ) {
      const formattedTodayTime = formatTime(hackatimeData.simpleData.todayTime);
      todayTime = formattedTodayTime;
    }
  });

  $inspect("Today's Time in sidebar.svelte:", todayTime);
</script>

<article>
  <p>Total Time</p>
  <strong>{totalTime || "No data available"}</strong>
</article>
<article>
  <p>Today's Time</p>
  <strong>{todayTime || "No data available"}</strong>
</article>
