<script>
import {hackatimeData} from "./main.svelte";
let randomWelcomeWords = [
  "Welcome",
  "Greetings",
  "Salutations",
  "Howdy",
  "Hello",
  "Hi",
  "Hey",
  "Hej",
  "Hola"
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
  "Thanks AI for these random phrases."
];
let pickedWelcomeWord = randomWelcomeWords[Math.floor(Math.random() * randomWelcomeWords.length)];
let pickedDescWord = randomDescWords[Math.floor(Math.random() * randomDescWords.length)];
</script>

<div id="body">
  <div class="row"><h1>{pickedWelcomeWord} {hackatimeData.simpleData.userName || "Username Not Found"}!</h1></div>
  <div class="row">
    <p>{pickedDescWord}</p>
  </div>
</div>

<style>
  #body {
    padding: 1.25rem;
    overflow-y: auto;
  }
  .row {
    text-align: center;
    justify-content: center;

    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
</style>
