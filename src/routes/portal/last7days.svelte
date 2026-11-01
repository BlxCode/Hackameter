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
  let last7DaysTotal = $state(
    hackatimeData.simpleData.last7DaysTotal || "No data available",
  );
  let averageDailyTime = $state(
    hackatimeData.simpleData.last7DaysAverage || "No data available",
  );
  $effect(() => {
    if (last7DaysTotal !== undefined && last7DaysTotal !== null) {
      console.log("Last 7 Days Total in last7days.svelte:", last7DaysTotal);
      if (hackatimeData.simpleData.last7DaysTotal) {
        const formattedLast7DaysTotal = formatTime(
          hackatimeData.simpleData.last7DaysTotal,
        );
        last7DaysTotal = formattedLast7DaysTotal;
      }
    }
    if (averageDailyTime !== undefined && averageDailyTime !== null) {
      console.log("Average Daily Time in last7days.svelte:", averageDailyTime);
      if (hackatimeData.simpleData.last7DaysAverage) {
        const formattedAverageDailyTime = formatTime(
          hackatimeData.simpleData.last7DaysAverage,
        );
        averageDailyTime = formattedAverageDailyTime;
      }
    }
  });
</script>

<article>
  <p>Total</p>
  <strong>{last7DaysTotal || "No data available"}</strong>
</article>

<article>
  <p>Average Daily Time</p>
  <strong>{averageDailyTime || "No data available"}</strong>
</article>
