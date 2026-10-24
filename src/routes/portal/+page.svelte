<script>
  import STONKS from "#lib/assets/STONKS.png";
  import Dashboard, { socket } from "./main.svelte";
  const HACKATIME_UID = import.meta.env.VITE_HACKATIME_UID;
  let dashboardHidden = $state(true);
  import { onMount } from "svelte";
  let currentUrl = $state();
  import { dev } from "$app/env";
  let isConnected = $state(socket.connected);
  // init ig
  onMount(() => {
    setTimeout(() => {
      isConnected = socket.connected;
      if (!isConnected) {
        console.error(
          "Socket connection failed. Please check your internet connection or try again later.",
        );
        alert(
          "Server connection failed. Please check your internet connection or try again later.",
        );
      }
    }, 5000);
    currentUrl = window.location.href;
    // if user dosnt have code and first time in this site
    if (localStorage.getItem("loginToken")) {
      socket.emit("auth", { loginToken: localStorage.getItem("loginToken") });
      socket.on("auth_response", (data) => {
        dashboardHidden = false;
      });
    } else if (!currentUrl.includes("code=")) {
      window.location.href = dev
        ? "http://localhost:5173"
        : "https://hackameter.blxm.me";
    }
    // if user has code and first time in this site
    else if (currentUrl.includes("code=")) {
      const code = currentUrl.split("code=")[1].split("&")[0];
      const msg = {
        code: code,
        type: "authorization_code",
        uri: `${window.location.origin}/portal`,
        loginToken: null,
      };
      try {
        socket.emit("auth", msg);
      } catch (error) {
        alert(
          "Error emitting auth event: " +
            error +
            ". Please try again, and if the problem persists, dm me on slack or smth.",
        );
      }

      socket.on("auth_response", (data) => {
        console.log("Received auth_response:", data);
        if (data.success) {
          console.log(
            "Successfully authenticated with HackaTime. Redirecting to portal...",
          );
          dashboardHidden = false;
          localStorage.setItem("loginToken", data.loginToken);
           window.location.href = dev
        ? "http://localhost:5173/portal"
        : "https://hackameter.blxm.me/portal";
        } else {
          if (data.error == "invalid_grant") {
            console.error(
              "Invalid grant error: The authorization code is invalid, already used or has expired. Relogin to HackaTime to get a new code.",
            );
            window.location.href = dev
              ? "http://localhost:5173"
              : "https://hackameter.blxm.me";
            return;
          }
          if (data.error == "Invalid login token") {
            localStorage.removeItem("loginToken");
            alert("Invalid login token. Please try logging in again.");

            window.location.href = dev
              ? "http://localhost:5173"
              : "https://hackameter.blxm.me";
            return;
          }
          alert(
            "An error occurred: " +
              data.error +
              ". Please try again, and if the problem persists, dm me on slack or smth.",
          );
          window.location.href = dev
            ? "http://localhost:5173"
            : "https://hackameter.blxm.me";
        }
      });
    }
    // if user denied access to the app
    else if (currentUrl.includes("error=")) {
      const error = currentUrl.split("error=")[1].split("&")[0];
      console.log(error);
      if (error === "access_denied") {
        alert("seriously bro? you denied access to the app? smh");
        window.location.href = dev
          ? "http://localhost:5173"
          : "https://hackameter.blxm.me";
      } else {
        alert(
          "An error occurred: " +
            error +
            ". Please try again, and if the problem persists, dm me on slack or smth.",
        );
      }
    }
  });
</script>

<header hidden={!dashboardHidden} class="container">
  <div id="spinner-container" data-tooltip="Loading...">
    <svg id="spinner" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"
      ><!--!Font Awesome Free v7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path
        d="M286.7 96.1C291.7 113 282.1 130.9 265.2 135.9C185.9 159.5 128.1 233 128.1 320C128.1 426 214.1 512 320.1 512C426.1 512 512.1 426 512.1 320C512.1 233.1 454.3 159.6 375 135.9C358.1 130.9 348.4 113 353.5 96.1C358.6 79.2 376.4 69.5 393.3 74.6C498.9 106.1 576 204 576 320C576 461.4 461.4 576 320 576C178.6 576 64 461.4 64 320C64 204 141.1 106.1 246.9 74.6C263.8 69.6 281.7 79.2 286.7 96.1z"
      /></svg
    >
  </div>
</header>

<main hidden={dashboardHidden}>
  <Dashboard />
</main>

<style>
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
  header {
    position: fixed;
    width: 100%;
    height: 100vh;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(1.01);
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
