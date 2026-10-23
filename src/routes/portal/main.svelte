<script module>
  import { io } from "socket.io-client";
  console.log("Initializing socket connection...");
  import { dev } from "$app/env";

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

  function apiRequest(endpoint, data) {
    return new Promise((resolve, reject) => {
      endpoint = "https://hackatime.hackclub.com/api/v1/" + endpoint;
      socket.emit("api_request", { endpoint, data });

      socket.on("api_response", (response) => {
        if (response.success) {
          console.log("API request successful:", response.data);
          resolve(response.data);
        } else {
          reject(response.error);
        }
      });
    });
  }
</script>
