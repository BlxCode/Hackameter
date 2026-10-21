import { Server } from "socket.io";
import "dotenv/config";
console.log("Starting server...");
const io = new Server({
  path: "/hackameter",
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174","https://hackameter.blxm.me"],
  },
});
let currUsers = 0;
io.on("connection", (socket) => {
  let accessToken = null;
  console.log("a user connected", socket.id);
  currUsers++;
  console.log("current users:", currUsers);

  // auth coming in from client handeling
  socket.on("auth", (msg) => {
    console.log("Received auth message:", msg);

    fetch("https://hackatime.hackclub.com/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: process.env.HACKATIME_UID,
        code: msg.code,
        redirect_uri: msg.uri,
        grant_type: "authorization_code",
        client_secret: process.env.HACKATIME_SECRET,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.error("Error in response from HackaTime:", data.error);
          socket.emit("auth_response", { error: data.error, success: false });
        } else {
          console.log("Received data from HackaTime:", data);
          socket.emit("auth_response", { success: true });
          // IF SUCCESSFUL, STORE ACCESS TOKEN
          if (
            data.scope == "profile read" &&
            data.access_token &&
            data.token_type == "Bearer"
          ) {
            data.access_token ? (accessToken = data.access_token) : null;
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching token from HackaTime:", error);
        socket.emit("auth_response", {
          error: "Failed to fetch token",
          success: false,
        });
      });
  });

  socket.on("api_request", (msg) => {
    if (!accessToken) {
      console.error("No access token available for API request.");
      socket.emit("api_response", {
        error: "No access token available",
        success: false,
      });
      return;
    }

  });

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    currUsers--;
    console.log("current users:", currUsers);
  });
});

io.listen(3068);
