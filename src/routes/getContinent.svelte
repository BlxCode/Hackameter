<script module>
  import { io } from "socket.io-client";

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
  export const server = await getContinent();
</script>
