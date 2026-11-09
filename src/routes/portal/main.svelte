<script module>
  import { io } from "socket.io-client";
  console.log("Initializing socket connection...");
  import { dev } from "$app/env";
  import { v4 as uuidv4 } from "uuid";
  import Sidebar from "./sidebar.svelte";
  import Header from "./header.svelte";
  import Dashboard from "./dashboard.svelte";
  import Achievements from "./achievements.svelte";
  let menuClicked = $state(false);
  let connected = $state(false);
  import ApiRequests from "./apiRequests.svelte";
  const Dashboards = {
    overview: Dashboard,

    achievements: Achievements,
  };

  async function getContinent() {
    try {
      const response = await fetch("https://get.geojs.io/v1/ip/geo.json");

      if (!response.ok) {
        throw new Error(`GeoJS returned ${response.status}`);
      }

      const data = await response.json();

      console.log("Current Continent:", data.continent_code);

      const continentMap = {
        NA: "NA",
        EU: "EU",
        AS: "EU",
        SA: "NA",
        AF: "EU",
        OC: "NA",
        AN: "NA",
      };

      return continentMap[data.continent_code] ?? "NA";
    } catch (error) {
      console.error("Continent detection failed:", error);
      return "NA";
    }
  }
export const dashboardCurrentlyShown = $state({data: "overview"});
  let currentDashboard = $state("overview");
  let DashboardToRender = $derived(Dashboards[currentDashboard]);

  function changeDashboard(page) {
    if (Dashboards[page]) {
      console.log("Changing dashboard to:", page);
      currentDashboard = page;
      dashboardCurrentlyShown.data = page;
      menuClicked = false;
    }
  }

  export const authenticated = $state({ value: false });
  export const hackatimeData = $state({
    data: [],
    simpleData: [],
    apiRequests: [],
  });
  // socket init
  console.log("Mounting socket connection...");

  const continent = await getContinent();

  console.log("Selected region:", continent);

  const url = dev
    ? "http://localhost:3068"
    : continent === "NA"
      ? "https://test-api.blxm.me"
      : "https://nest-api.blxm.me";

  export const socket = io(url, {
    path: "/hackameter",
    autoConnect: true,
    transports: ["websocket"],
  });

  setTimeout(() => {
    if (!socket.connected) {
      console.error(
        "Socket connection failed to ",
        url,
        " Please check your internet connection or try a vpn to connect to the other server again later.",
      );
      connected = false;
    }
  }, 5000);
  socket.on("connect", () => {
    console.log("Connected to server via socket.io");
    connected = true;
  });
  socket.on("alert", (msg) => {
    console.log(msg);
  });
  // AUTHENTICATOR
  socket.on("auth_response", (data) => {
    if (data.success) {
      console.log("Authentication successful:", data);

      authenticated.value = true;

      //make extra api requests
      apiRequest("aboutUser");
    } else {
      authenticated.value = false;
      console.error("Authentication failed:", data.error);
      if (data.error == "Invalid login token") {
        localStorage.removeItem("loginToken");
        location.reload();
      }
    }
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from server");
  });

  // API
  export async function apiRequest(apiName = "dashboard", callback = null) {
    const apiId = uuidv4();

    if (!authenticated.value) {
      console.error("User is not authenticated.");

      hackatimeData.apiRequests[apiId] = {
        status: "error",
        success: false,
        error: "Not authenticated",
      };

      if (callback) callback(apiId);
      return apiId;
    }

    hackatimeData.apiRequests[apiId] = {
      status: "pending",
    };

    return new Promise((resolve) => {
      socket.once(`api_response${apiId}`, (response) => {
        hackatimeData.apiRequests[apiId] = {
          status: response.success ? "success" : "error",
          success: response.success,
          error: response.success ? undefined : response.error,
        };

        if (response.success) {
          hackatimeData.data[apiId] = response.data;
        }

        if (callback) callback(apiId);

        resolve(apiId);
      });

      socket.emit("api_request", {
        id: apiId,
        apiName: apiName,
      });
    });
  }

  // responsive stuff
</script>

<dialog style="z-index: 1000;" open={!connected} id="dialog" role="dialog">
  <strong>Server has failed to connect. Notes: {socket}</strong>
</dialog>
<div id="portal-container">
  <header style="padding: 0.5rem;" id="top">
    <Header bind:menuClicked />
  </header>
  <aside style="display: {menuClicked ? 'block' : 'none'};">
    <Sidebar bind:changeDashboard bind:currentDashboard />
  </aside>
  <main>
    <DashboardToRender />
  </main>
</div>
<ApiRequests />
<style>
  @media (width <= 1000px) {
    aside {
      display: none;
      position: fixed;
      top: 90px;
      left: 0.5rem;
      border-top: 1px solid var(--pico-secondary-border);

      width: 235px;
      height: calc(100vh - 90px + 0.1rem);
      box-shadow: 2rem 0 1rem rgba(0, 0, 0, 0.1);
    }
    #portal-container {
      grid-template-areas:
        "header header"
        "content content"
        "footer footer" !important;
    }
    main {
      padding-left: 0.25rem;
      padding-right: 0.25rem;
    }
  }
  @media (width > 1000px) {
    aside {
      display: block !important;
    }
    main {
      padding-left: 5%;
      padding-right: 5%;
    }
  }
  #portal-container {
    overflow: hidden;
    padding-top: 0;
    display: grid;
    height: 100vh;
    width: 100vw;
    grid-template-areas:
      "header header"
      "menu content"
      "footer footer";
    grid-template-columns: 250px 4fr;
    grid-template-rows: auto 1fr auto;
    gap: 0;
    font-family: "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif !important;
  }

  aside {
    background-color: var(--pico-background-color);
    grid-area: menu;
    border-right: 1px solid var(--pico-secondary-border);
    display: block;
    padding: 0.25rem;
    z-index: 7666767674852375235;
  }
  header {
    grid-area: header;
    padding: 0.25rem;
    border-bottom: 1px solid var(--pico-secondary-border);
  }
  main {
    overflow-y: auto;
    padding-top: 0.25rem;
    padding-bottom: 0.25rem;
    overflow-x: hidden;
    grid-area: content;
  }
</style>
