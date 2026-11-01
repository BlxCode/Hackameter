<script>
  import { hackatimeData } from "./main.svelte";
  import Overview from "./overview.svelte";
  import Last7Days from "./last7days.svelte";
  let randomWelcomeWords = [
    "Welcome",
    "Greetings",
    "Salutations",
    "Howdy",
    "Hello",
    "Hi",
    "Hey",
    "Hej",
    "Hola",
  ];
  let randomDescWords = [
    "Welcome to the HackaTime Dashboard!",
    "Your coding journey starts here.",
    "Track your coding time and progress.",
    "Discover your coding habits.",
    "Analyze your coding patterns.",
    "Unleash your coding potential.",
    "Your coding insights await.",
    "Dive into your coding statistics.",
    "Explore your coding achievements.",
    "Your coding performance at a glance.",
    "Stay motivated and keep coding!",
    "Your coding journey, visualized.",
    "Track your coding milestones.",
    "Your coding progress, simplified.",
    "Discover your coding strengths.",
    "Your coding journey, one click away.",
    "Your coding time, optimized.",
    "Your coding habits, analyzed.",
    "Your coding performance, tracked.",
    "Your coding achievements, celebrated.",
    "Thanks AI for these random phrases.",
  ];
  let pickedWelcomeWord =
    randomWelcomeWords[Math.floor(Math.random() * randomWelcomeWords.length)];
  let pickedDescWord =
    randomDescWords[Math.floor(Math.random() * randomDescWords.length)];
</script>

<div id="body">
  <div class="row">
    <h1>
      {pickedWelcomeWord}
      {hackatimeData.simpleData.userName || "Username Not Found"}!
    </h1>
  </div>
  <div class="row">
    <p>{pickedDescWord}</p>
  </div>
  <h2 id="overview top">Overview</h2>
  <div class="row">
    <Overview />
  </div><br>
  <h2>Last 7 Days</h2><br>
  <div class="row"><Last7Days /></div>
</div>

<style>
  #body {
    padding: 1.25rem;
    overflow-y: auto;
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
