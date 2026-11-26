<script>
  import { hackatimeData, apiRequest, authenticated } from "./main.svelte";
  import { socket } from "./initiateSocket.svelte";
  const userName = $state({ data: "Username Not Found" });
  let { changeDashboard, currentDashboard } = $props();

  let imageSrc = $state(
    "https://www.blxm.me/_app/immutable/assets/kakaReder.Dh_f2OKQ.png",
  );
  $effect(() => {
    if (hackatimeData.simpleData.userName) {
      userName.data = hackatimeData.simpleData.userName;
      imageSrc = hackatimeData.simpleData.photo || imageSrc;
    }
  });
  function logout() {
    sessionStorage.removeItem("loginToken");
    location.reload();
  }
</script>

<nav>
  <section
    aria-label="User Info"
    style="width: fit-content; display: flex; align-items: center; margin-bottom: 1rem;"
  >
    <img
      src={imageSrc}
      alt="User Image"
      width="45"
      height="45"
      style="border-radius: 50%;"
      draggable="false"
    />
    <h3 style="margin-top: auto; margin-bottom:auto; margin-left: 0.5rem;">
      {userName.data}
    </h3>
  </section>
  <section aria-label="Stats">
    <small>Stats</small>
    <ul>
      <li>
        <a
          href=""
          aria-current={currentDashboard === "overview" ? "page" : "none"}
          class={currentDashboard === "overview" ? "outline" : ""}
          onclick={(e) => changeDashboard("overview")}>Overview</a
        >
      </li>
      <li>
        <a
          href=""
          aria-current={currentDashboard === "achievements" ? "page" : "none"}
          class={currentDashboard === "achievements" ? "outline" : ""}
          onclick={(e) => changeDashboard("achievements")}>Achievements</a
        >
      </li>
      <section />
      <section aria-label="HackaMeter Exclusives">
        <small>HackaMeter Exclusives</small>

        <li>
          <a
            href=""
            aria-current={currentDashboard === "bigGoals" ? "page" : "none"}
            class={currentDashboard === "bigGoals" ? "outline" : ""}
            onclick={(e) => changeDashboard("bigGoals")}>Big Goals</a
          >
        </li>

        <li>
          <a
            href=""
            aria-current={currentDashboard === "settings" ? "page" : "none"}
            class={currentDashboard === "settings" ? "outline" : ""}
            onclick={(e) => changeDashboard("settings")}>Settings</a
          >
        </li>
      </section>
    </ul>
  </section>
 
  <section
    aria-label="Options"
    id="portal-header-buttons"
    style="display: flex; flex-direction: column; gap: 0.5rem; margin-top: 1rem;"
  >
    <small>Options</small>
    <ul>
      <li>
        <button class="outline secondary" onclick={logout}>Logout</button>
      </li>
    </ul>
  </section>
</nav>

<style>
  @media (width <= 1000px) {
    #portal-header-buttons {
      display: block !important;
    }
  }
  @media (width > 1000px) {
    #portal-header-buttons {
      display: none !important;
    }
  }
  .li-link {
margin-bottom: 0.01rem !important;
  }
  section[aria-label="Links"] {
    margin-top: auto;
  }
  nav {
    padding: 1rem;
    text-align: left;
    height: 100%;
    overflow-y: auto;
    box-sizing: border-box;
     display: flex; 
    justify-content: flex-start;
    flex-direction: column;
    align-items: stretch;
  }
  nav a {
    cursor: pointer;
    transition:
      border-color background-color 0.2s ease,
      color 0.2s ease;
    border: 1px solid transparent;
  }

  nav a:hover {
    border-color: var(--pico-primary-background);
    color: var(--pico-primary);
    text-decoration: none;
  }
  nav a.outline {
    background-color: var(--pico-text-selection-color);

    color: var(--pico-primary);
  }
</style>
