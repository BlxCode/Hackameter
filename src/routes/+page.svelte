<script>
  import STONKS from "#lib/assets/STONKS.png";
  const HACKATIME_UID = import.meta.env.VITE_HACKATIME_UID;
  import { onMount } from "svelte";
  let redirectUrl = $state();
  onMount(() => {
    redirectUrl = window.location.origin;
  });

  console.log(HACKATIME_UID, redirectUrl);
</script>

<header class="container">
  <hgroup>
    <h1>HackaMeter</h1>
    <p class="text-xlg">
      The <strong>ultimate</strong>
      <a class="text-blue-300 underline" href="https://hackatime.hackclub.com/"
        >HackaTime</a
      > extension
    </p>
  </hgroup>
  <a
    href="https://hackatime.hackclub.com/oauth/authorize?client_id={HACKATIME_UID}&redirect_uri={redirectUrl ||
      'https://hackameter.blxm.me'}%2Fportal&response_type=code&scope=profile+read"
    ><button class="primary">Login with HackaTime</button></a
  ><br /><br />
</header>

<style>
  * {
    text-align: center;
    font-family: "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif;
  }
  header {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  h1 {
    font-size: 5rem;
  }
  p {
    font-size: 1.5rem;
  }
  button {
    font-size: 1.5rem;
    font-weight: 500;
    padding: 1rem;
    padding-left: 2rem;
    padding-right: 2rem;
  }
</style>
