import { Server } from "socket.io";
import { encryptToken, decryptToken } from "./hackatimeTokenEncryption.js";
import fs from "fs";
import "dotenv/config";
console.log("Starting server...");
const hackatimeTokensJson = fs.readFileSync("tokens.json", "utf8");
// delete old tokens
const hackatimeTokens = JSON.parse(hackatimeTokensJson);
const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000); // 60 days in milliseconds
// delete old tokens after boot
for (const userId of Object.keys(hackatimeTokens)) {
  const tokenData = hackatimeTokens[userId];
  const timestamp = tokenData.timestamp;
  if (Date().now() - sixtyDaysAgo > timestamp) {
    // delete the old token
    delete hackatimeTokens[userId];
  }
}

const io = new Server({
  path: "/hackameter/",
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://hackameter.blxm.me",
      "https://hackameter-git-main-blxcodes-projects.vercel.app/",
      "https://hackameter.vercel.app/",
    ],
  },
});
let currUsers = 0;
io.on("connection", (socket) => {
  let accessToken = null;
  let loginToken = null;
  let userId = null;
  console.log("a user connected", socket.id);
  currUsers++;
  console.log("current users:", currUsers);

  // auth coming in from client handeling
  socket.on("auth", (msg) => {
    console.log("Received auth message from :", socket.id);
    // my way
    if (msg.loginToken != null && msg.loginToken != undefined) {
      
      // if login token is present, decrypt it and check if it is valid
      const decryptedToken = decryptToken(msg.loginToken);
      const [userIdFromToken, emailFromToken] = decryptedToken.split(":");
      if (
        hackatimeTokens[userIdFromToken] &&
        hackatimeTokens[userIdFromToken].loginToken === msg.loginToken
      ) {
        accessToken = decryptToken(
          hackatimeTokens[userIdFromToken].hackatimeToken,
        );
        userId = userIdFromToken;
        console.log(
          "Successfully authenticated with Login Token. Redirecting to portal...",
        );

        socket.emit("auth_response", {
          success: true,
          loginToken: msg.loginToken,
        });
        return;
      } else {
        console.error("Invalid login token provided.");
        socket.emit("auth_response", {
          error: "Invalid login token",
          success: false,
        });
        return;
      }
    } // hackatime
    else if (msg.code && msg.uri) {
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
            console.error("Error in response from HackaTime:", data);
            socket.emit("auth_response", { error: data.error, success: false });
          } else {
            // IF SUCCESSFUL, STORE ACCESS TOKEN
            if (
              data.scope == "profile read" &&
              data.access_token &&
              data.token_type == "Bearer"
            ) {
              data.access_token ? (accessToken = data.access_token) : null;
              fetch("https://hackatime.hackclub.com/api/v1/authenticated/me", {
                headers: {
                  Authorization: "Bearer " + accessToken,
                },
              })
                .then((response) => response.json())
                .then((data) => {
                  if (data) {
                    userId = data.id;
                   
                     loginToken = encryptToken(
                      userId + ":" + data.emails[0],
                    );
                    if(loginToken){
                    hackatimeTokens[userId] = {
                      userId: userId,
                      loginToken: loginToken,
                      hackatimeToken: encryptToken(accessToken),
                      timestamp: Date.now(),
                    };
                    socket.emit("auth_response", {
                      success: true,
                      loginToken: loginToken,
                    });

                    fs.writeFileSync(
                      "tokens.json",
                      JSON.stringify(hackatimeTokens, null, 2),
                    );
                  }
                  } else {
                    if (data.error) {
                      console.error("Error in response from HackaTime:", data);
                      socket.emit("auth_response", {
                        error: data.error,
                        success: false,
                      });
                    } else {
                      console.error(
                        "Unexpected response from HackaTime:",
                        data,
                      );
                      socket.emit("auth_response", {
                        error: "Unexpected response from HackaTime",
                        success: false,
                      });
                    }
                  }
                })
                .catch((error) => {
                  console.error(
                    "Error fetching user data from HackaTime:",
                    error,
                  );
                  socket.emit("auth_response", {
                    error: "Failed to fetch user data",
                    success: false,
                  });
                });
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
    }
  });

  socket.on("api_request", (msg) => {
    if (!accessToken) {
      console.error("No access token available for API request.");
      socket.emit("api_response", {
        error: "No access token available",
        success: false,
      });
      return;
    } else {
      // where all the api requests are handled
      fetch("https://hackatime.hackclub.com/api/v1/" + msg.endpoint, {
        body: JSON.stringify(msg.data),
      })
        .then((response) => response.json())
        .then((data) => {
          socket.emit("api_response", { data, success: true });
        })
        .catch((error) => {
          console.error("Error fetching API data:", error);
          socket.emit("api_response", {
            error: "Failed to fetch API data",
            success: false,
          });
        });
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    currUsers--;
    console.log("current users:", currUsers);
  });
});

io.listen(3068);
