<script>
  import { onMount } from "svelte";

  let redirectUrl = $state();
  let linkUrl = $state();
  let whenMounted = $state(false);
  import { server } from "./getContinent.svelte";
  onMount(() => {
    //get continent actually now gets the closest server

    const NA_UID = import.meta.env.VITE_NA_UID;
    console.log("Server detected:", server);
    redirectUrl = window.location.origin;
    if (localStorage.getItem("loginToken")) {
      if (
        localStorage.getItem("loginToken") == null ||
        localStorage.getItem("loginToken") == undefined ||
        localStorage.getItem("loginToken") == ""
      ) {
        localStorage.removeItem("loginToken");
        window.location.href = dev
          ? "http://localhost:5173"
          : "https://hackameter.blxm.me";
        return;
      }
      whenMounted = true;

      linkUrl = `${redirectUrl || "https://hackameter.blxm.me"}/portal?server=${server}`;
    } else {
      whenMounted = true;

      const params = new URLSearchParams({
        client_id: NA_UID,
        redirect_uri: `${redirectUrl}/portal`,
        response_type: "code",
        scope: "profile read",
      });

      linkUrl = `https://hackatime.hackclub.com/oauth/authorize?${params}`;
      $effect(() => {
        const params = new URLSearchParams({
          client_id: NA_UID,
          redirect_uri: `${redirectUrl}/portal`,
          response_type: "code",
          scope: "profile read",
        });

        linkUrl = `https://hackatime.hackclub.com/oauth/authorize?${params}`;
      });
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
    ><button
      disabled={!whenMounted}
      aria-busy={!whenMounted}
      class="primary"
      data-tooltip={whenMounted
        ? `Connected to ${server} server...`
        : "Loading..."}
    >
      Enter HackaMeter</button
    ></a
  >
  <a
    href="https://hackclub.enterprise.slack.com/archives/C0CBY1UKFK6"
    target="_blank"
    rel="noopener noreferrer"
  >
    <button class="secondary">Slack Channel</button>
  </a>
  <br /><br />
</header>

<style>
  header {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  h1 {
    font-size: max(3vw, 60px);

    word-wrap: normal;
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
