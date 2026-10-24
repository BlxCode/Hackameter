<script module>
  import { io } from "socket.io-client";
  console.log("Initializing socket connection...");
  import { dev } from "$app/env";
  import Sidebar from "./sidebar.svelte";
  import Header from "./header.svelte";
  import Dashboard from "./dashboard.svelte";
  // socket init
  console.log("Mounting socket connection...");
  export const socket = io(
    dev ? "http://localhost:3068" : "https://test-api.blxm.me",
    { path: "/hackameter", autoConnect: true },
  );

  socket.on("connect", () => {
    console.log("Connected to server via socket.io");
  });

  socket.on("auth_response", (data) => {
    console.log("Received auth_response:", data);
    if (data.success) {
    }
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from server");
  });
  socket.on("api_response", (response) => {
    if (response.success) {
      console.log("API request successful:", response.data);
      resolve(response.data);
    } else {
      reject(response.error);
    }
  });
  function apiRequest(endpoint, data) {
    return new Promise((resolve, reject) => {
      endpoint = "https://hackatime.hackclub.com/api/v1/" + endpoint;
      socket.emit("api_request", { endpoint, data });
    });
  }
</script>

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
    grid-template-columns: 1fr 4fr;
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
