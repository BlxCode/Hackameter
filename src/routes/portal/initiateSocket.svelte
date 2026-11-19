<script module>
  import { io } from "socket.io-client";
  import { dev } from "$app/env";
  import { browser } from "$app/env";

  export const connected = $state({ value: false });
  //get continent actually now gets the closest server
 async function getContinent() {
    const params = browser
      ? new URLSearchParams(window.location.search)
      : new URLSearchParams();
    if (params.has("server")) {
      const serverParam = params.get("server");
      if (serverParam === "NA" || serverParam === "EU") {
        console.log("Server parameter provided:", serverParam);
        return serverParam;
      } else {
        console.warn(
          "Invalid server parameter provided. Defaulting to NA server.",
        );
        return "NA";
      }
    }
    console.log(
      "No server parameter provided. Defaulting to NA server. If you are in Europe, please use the EU server by adding ?server=EU to the URL.",
    );
    return "NA";
  }
const continent = browser ? getContinent() : null;
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
      connected.value = false;
    }
  }, 5000);
  socket.on("connect", () => {
    console.log("Connected to server via socket.io");
    connected.value = true;
  });
  socket.on("alert", (msg) => {
    console.log(msg);
  });
</script>
