<script>
  import STONKS from "#lib/assets/STONKS.png";
  import { onMount } from "svelte";

  let continent = $state("NA");
  let redirectUrl = $state();
  let linkUrl = $state();
  let whenMounted = $state(false);
  onMount(() => {
    async function fetchContinent() {
      setTimeout(() => {
        if(!whenMounted){
          continent = "NA";
          whenMounted = true;
        }
      }, 500);
      fetch("https://get.geojs.io/v1/ip/geo.json")
        .then((response) => response.json())
        .then((data) => {
          console.log("Current Continent:", data.continent_code);
          switch (data.continent_code) {
            case "NA":
              continent = "NA";
              break;
            case "EU":
              continent = "EU";
              break;
            case "AS":
              continent = "EU";
              break;
            case "SA":
              continent = "NA";
              break;
            case "AF":
              continent = "EU";
              break;
            case "OC":
              continent = "NA";
              break;
            case "AN":
              continent = "NA";
              break;
            default:
              continent = "NA";
              break;
          }
          console.log(continent);

          whenMounted = true;
        });
    }
    const NA_UID = import.meta.env.VITE_NA_UID;
    const EU_UID = import.meta.env.VITE_EU_UID;

    fetchContinent();

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
      linkUrl = `${redirectUrl || "https://hackameter.blxm.me"}/portal`;
    } else {
      console.log(continent);
      linkUrl = `https://hackatime.hackclub.com/oauth/authorize?client_id=${continent == "EU" ? EU_UID : NA_UID}&redirect_uri=${redirectUrl || "https://hackameter.blxm.me"}%2Fportal&response_type=code&scope=profile+read`;
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
        ? `Connecting to ${continent} server...`
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
