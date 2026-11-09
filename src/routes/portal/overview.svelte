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
  let streakColor = $state("var(--pico-card-background-color)");
  let streakBorderColor = $state("var(--pico-card-border-color)");
  let totalTime = $state(
    hackatimeData.simpleData.totalTime || "No data available",
  );
  let todayTime = $state(
    hackatimeData.simpleData.todayTime || "No data available",
  );
  let todayGoalTarget = $state(hackatimeData.simpleData.todayGoalTarget || 0);
  let todayGoalPercent = $state(0);
  let isDarkMode = $state(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches,
  );
  $effect(() => {
    if (totalTime !== undefined && totalTime !== null) {
      console.log("Total Time in sidebar.svelte:", totalTime);
      if (hackatimeData.simpleData.totalTime) {
        const formattedTotalTime = formatTime(
          hackatimeData.simpleData.totalTime,
        );
        totalTime = formattedTotalTime;
      }

      if (
        hackatimeData.simpleData.todayTime !== undefined &&
        hackatimeData.simpleData.todayTime !== null
      ) {
        const formattedTodayTime = formatTime(
          hackatimeData.simpleData.todayTime,
        );
        todayTime = formattedTodayTime;
      }

      if (
        hackatimeData.simpleData.todayGoalTarget !== undefined &&
        hackatimeData.simpleData.todayGoalTarget !== null
      ) {
        const formattedTodayGoalTarget = formatTime(
          hackatimeData.simpleData.todayGoalTarget,
        );
        todayGoalTarget = formattedTodayGoalTarget;
      }

      if (
        hackatimeData.simpleData.streak !== undefined &&
        hackatimeData.simpleData.streak !== null
      ) {

        if (hackatimeData.simpleData.streak >= 60) {
          streakColor = isDarkMode ? "#182C46" : "#E5F0FC";
          streakBorderColor = isDarkMode ? "#315578" : "#A9C8EB";
        } else if (hackatimeData.simpleData.streak >= 30) {
          streakColor = isDarkMode ? "#453510" : "#FFF4D6";
          streakBorderColor = isDarkMode ? "#796027" : "#E8CB83";
        } else if (hackatimeData.simpleData.streak >= 14) {
          streakColor = isDarkMode ? "#30204B" : "#F1E9FC";
          streakBorderColor = isDarkMode ? "#594078" : "#CBB5E8";
        } else if (hackatimeData.simpleData.streak >= 7) {
          streakColor = isDarkMode ? "#421D19" : "#FCEAE7";
          streakBorderColor = isDarkMode ? "#78372C" : "#E9B6AD";
        } else if (hackatimeData.simpleData.streak >= 5) {
          streakColor = isDarkMode ? "#392719" : "#F9EEE3";
          streakBorderColor = isDarkMode ? "#704526" : "#E2C1A0";
        } else {
          streakColor = isDarkMode ? "#263B2D" : "#E8F5EB";
          streakBorderColor = isDarkMode ? "#426B4C" : "#B2D7BA";
        }
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
    <strong>
      <span data-tooltip={todayGoalPercent + "% of goal achieved"}>
        {todayTime || "No data available"} /
        <small class="muted">{todayGoalTarget || "No data available"}</small>
      </span><br />
      <progress
        style="margin: 0.5rem 0;"
        value={todayGoalPercent || 0}
        max="100"
      ></progress>
    </strong>
  </article>

  <article
    style=" 
     box-shadow:
      0 0 0 0.0625rem {streakBorderColor}33,
      0 0.0625rem 0.125rem 0 {streakBorderColor}22,
      0 0.25rem 0.75rem -0.25rem {streakBorderColor}44;background-color: {streakColor} !important; border: 1.5px solid {streakBorderColor} !important;"
  >
    <p >Current Streak</p>
    <strong>{hackatimeData.simpleData.streak || "No data available"}</strong>
  </article>
</div>

<style>
  article {
    flex: 1;
    vertical-align: middle;
    min-width: 15rem;
  }
</style>
