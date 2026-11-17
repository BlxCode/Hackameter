<script module>
  import { io } from "socket.io-client";
  import { dev } from "$app/env";
  export const connected = $state({ value: false });
  //get continent actually now gets the closest server
  async function getContinent() {
    return new Promise((resolve) => {
      let connected = false;

      const naServer = io("https://test-api.blxm.me", {
        path: "/hackameter",
        transports: ["websocket"],
        reconnection: false,
      });

      const euServer = io("https://nest-api.blxm.me", {
        path: "/hackameter",
        transports: ["websocket"],
        reconnection: false,
      });

      const finish = (region) => {
        if (connected) return;

        connected = true;

        naServer.disconnect();
        euServer.disconnect();

        clearTimeout(timeout);
        resolve(region);
      };

      naServer.on("connect", () => finish("NA"));
      euServer.on("connect", () => finish("EU"));

      const timeout = setTimeout(() => {
        if (!connected) {
          console.error(
            "Continent detection timed out. No servers could be reached",
          );
          finish("N/A");
        }
      }, 5000);
    });
  }
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
