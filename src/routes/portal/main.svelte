<script module>
  import { io } from "socket.io-client";
  console.log("Initializing socket connection...");
  import { dev } from "$app/env";
  import { v4 as uuidv4 } from "uuid";

  import Sidebar from "./sidebar.svelte";
  import Header from "./header.svelte";
  import Dashboard from "./dashboard.svelte";
  export const authenticated = $state({ value: false });
  export const hackatimeData = $state({
    data: [],
    apiRequests: [],
  });
  // socket init
  console.log("Mounting socket connection...");
  let connected = $state(false);
  export const socket = io(
    dev ? "http://localhost:3068" : "https://test-api.blxm.me",
    { path: "/hackameter", autoConnect: true },
  );
  setTimeout(() => {
    if (!socket.connected) {
      console.error(
        "Socket connection failed. Please check your internet connection or try again later.",
      );
      connected = false;
    }
  }, 5000);
  socket.on("connect", () => {
    console.log("Connected to server via socket.io");
    connected = true;
  });
  // AUTHENTICATOR
  socket.on("auth_response", (data) => {
    if (data.success) {
      console.log("Authentication successful:", data);

      authenticated.value = true;

      //make extra api requests
      apiRequest("api/v1/authenticated/me");
    } else {
      authenticated.value = false;
      console.error("Authentication failed:", data.error);
    }
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from server");
  });

  // API
  export async function apiRequest(
    endpoint,
    useWakatimeAuth = false,
    callback = null,
  ) {
    const apiId = uuidv4();

    if (!authenticated.value) {
      console.error("User is not authenticated.");

      hackatimeData.apiRequests[apiId] = {
        endpoint,
        status: "error",
        success: false,
        error: "Not authenticated",
      };

      if (callback) callback(apiId);
      return apiId;
    }

    hackatimeData.apiRequests[apiId] = {
      endpoint,
      status: "pending",
    };

    return new Promise((resolve) => {
      socket.once(`api_response${apiId}`, (response) => {
        hackatimeData.apiRequests[apiId] = {
          endpoint: response.endpoint ?? endpoint,
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
        endpoint,
        id: apiId,
        useWakatimeAuth,
      });
    });
  }
</script>

<dialog style="z-index: 1000;" open={!connected} id="dialog" role="dialog">
  <strong>Server has failed to connect. Notes: {socket}</strong>
</dialog>
<div id="portal-container">
  <header style="padding: 0.5rem;" id="top">
    <Header />
  </header>
  <aside>
    <Sidebar />
  </aside>
  <main>
    <Dashboard />
  </main>
</div>

<style>
  #portal-container {
    padding: 1rem;
    padding-top: 0;
    background-color: #151618;
    display: grid;
    height: 100vh;
    width: 100vw;
    grid-template-areas:
      "header header"
      "menu content"
      "footer footer";
    grid-template-columns: 235px 4fr;
    grid-template-rows: auto 1fr auto;
    gap: 0px;
    font-family: "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif !important;
  }

  aside {
    grid-area: menu;
    border-right: 1px solid #3b3f44;
  }
  header {
    grid-area: header;
    border-bottom: 1px solid #3b3f44;
  }
  main {
    grid-area: content;
  }
</style>
