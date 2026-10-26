<script module>
  import { io } from "socket.io-client";
  console.log("Initializing socket connection...");
  import { dev } from "$app/env";
  import { v4 as uuidv4 } from 'uuid';

  import Sidebar from "./sidebar.svelte";
  import Header from "./header.svelte";
  import Dashboard from "./dashboard.svelte";
  let authenticated = $state(false);
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
      authenticated = true;

      //make extra api requests
      apiRequest("authenticated/me");
    } else {
      authenticated = false;
      console.error("Authentication failed:", data.error);
    }
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from server");
  });

  // API
  export function apiRequest(endpoint) {
    const apiId = uuidv4();
    console.log("Making API request to endpoint:", endpoint, "with ID:", apiId);
    if (authenticated) {
      socket.emit("api_request", { endpoint: endpoint, id: apiId });
      hackatimeData.apiRequests[apiId] = {
        endpoint: endpoint,
        status: "pending",
      };
      socket.on("api_response" + apiId, (response) => {
        if (response.success) {
          hackatimeData.data[response.id] = response.data;
          hackatimeData.apiRequests[response.id] = {
            endpoint: response.endpoint,
            status: "success",
          };
          console.log("API request successful:", response.data);
        } else {
          console.error(response.error);
          hackatimeData.apiRequests[response.id] = {
            endpoint: response.endpoint,
            status: "error",
          };
        }
      });
      return apiId;
    } else {
      console.error("User is not authenticated. Cannot make API request.");
    }
  }
</script>

<dialog style="z-index: 1000;" open={!connected} id="dialog" role="dialog">
  <strong>Server has failed to connect. Notes: {socket}</strong>
</dialog>
<div id="portal-container">
  <header>
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
