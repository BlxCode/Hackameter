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
  let trend = $state(
    hackatimeData.simpleData.weeklyTrend || "No data available",
  );
  let trendColor = $state("var(--pico-card-background-color)");
  let trendBorderColor = $state("var(--pico-card-border-color)");
  let trendIncreaseOrDecrease = $state(
    hackatimeData.simpleData.weeklyTrendIncreaseOrDecrease ||
      "No data available",
  );
  let isDarkMode = $state(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches,
  );
  $effect(() => {
    if (last7DaysTotal !== undefined && last7DaysTotal !== null) {
      trendIncreaseOrDecrease =
        hackatimeData.simpleData.weeklyTrendIncreaseOrDecrease ||
        "No data available";
      trend = hackatimeData.simpleData.weeklyTrend + "%" || "No data available";
      if (trendIncreaseOrDecrease === "increase") {
        trendColor = isDarkMode ? "#263B2D" : "#E8F5EB";
        trendBorderColor = isDarkMode ? "#426B4C" : "#B2D7BA";
      } else if (trendIncreaseOrDecrease === "decrease") {
        trendColor = isDarkMode ? "#421D19" : "#FCEAE7";
        trendBorderColor = isDarkMode ? "#78372C" : "#E9B6AD";
      } else {
        trendColor = "var(--pico-card-background-color)";
        trendBorderColor = "var(--pico-card-border-color)";
      }
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

<div style="display:flex; flex-direction: row; gap: 0.5rem; flex-wrap: wrap;">
  <article>
    <p>Total</p>
    <strong>{last7DaysTotal || "No data available"}</strong>
  </article>

  <article>
    <p>Average Daily Time</p>
    <strong>{averageDailyTime || "No data available"}</strong>
  </article>
  <article
    style="  box-shadow:
      0 0 0 0.0625rem {trendBorderColor}33,
      0 0.0625rem 0.125rem 0 {trendBorderColor}22,
      0 0.25rem 0.75rem -0.25rem {trendBorderColor}44;background-color: {trendColor} !important; border: 1.5px solid {trendBorderColor} !important;"
  >
    <p>Weekly Trend</p>
    <strong
      >{trend || "No data available"}
      {trendIncreaseOrDecrease || "No data available"}</strong
    >
  </article>
</div>

<style>
  article {
    flex: 1;
    vertical-align: middle;
    min-width: 15rem;
  }
</style>
