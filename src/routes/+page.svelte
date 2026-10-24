<script>
  import STONKS from "#lib/assets/STONKS.png";
  import { writable } from "svelte/store";

  const HACKATIME_UID = import.meta.env.VITE_HACKATIME_UID;
  import { onMount } from "svelte";
  let redirectUrl = $state();
  let buttonText = writable("Enter HackaMeter");
  let linkUrl = $state();
  let whenMounted = $state(false);
  onMount(() => {
    setTimeout(() => {
      whenMounted = true;
    }, 500);
    redirectUrl = window.location.origin;
    if(localStorage.getItem("loginToken")){
          linkUrl = `${redirectUrl || "https://hackameter.blxm.me"}/portal`;

    } else {
    linkUrl = `https://hackatime.hackclub.com/oauth/authorize?client_id=${HACKATIME_UID}&redirect_uri=${redirectUrl || "https://hackameter.blxm.me"}%2Fportal&response_type=code&scope=profile+read`;
    }

  
  });
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
  <a href={linkUrl}
    ><button disabled={!whenMounted} aria-busy={!whenMounted} class="primary"
      >{$buttonText}</button
    ></a
  ><br /><br />
</header>

<style>
 
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
  @keyframes rotate-arc {
    to {
      transform: translate(-50%, -50%) rotate(360deg);
    }
  }
  * {
    text-align: center;
    font-family: "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif;
  }
  #spinner-container {
    cursor: default;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 10rem;
    height: 10rem;
  }
  #spinner {
    width: 10rem;
    height: 10rem;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation: rotate-arc 1.5s linear infinite;
  }
</style>
