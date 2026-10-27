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
const hackameterApiToken = process.env.HACKATIME_SECRET;
for (const userId of Object.keys(hackatimeTokens)) {
  const tokenData = hackatimeTokens[userId];
  const timestamp = tokenData.timestamp;
  if (Date.now() - sixtyDaysAgo > timestamp) {
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
  let slackId = null;
  let wakatimeApiKey = null;
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
          client_secret: hackameterApiToken,
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
                    slackId = data.slack_id;
                    loginToken = encryptToken(userId + ":" + data.emails[0]);
                    if (loginToken) {
                      hackatimeTokens[userId] = {
                        userId: userId,
                        loginToken: loginToken,
                        hackatimeToken: encryptToken(accessToken),
                        timestamp: Date.now(),
                      };

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
          return;
        });
    }
    // get wakatime api key
    fetch("https://hackatime.hackclub.com/api/v1/authenticated/api_keys", {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          wakatimeApiKey = data.token;
          socket.emit("auth_response", {
            success: true,
            loginToken: msg.loginToken,
          });
        } else {
          console.error("No WakaTime API keys found for the user.");
        }
      })
      .catch((error) => {
        console.error("Error fetching WakaTime API key:", error);
      });
  });
  socket.on("api_request", (msg) => {
    if (!accessToken || !userId || !wakatimeApiKey) {
      console.error("No access token available for API request.");
      socket.emit("api_response", {
        error: "No access token available",
        success: false,
      });
      return;
    } else {
      // where all the api requests are handled
      let endpoint = msg.endpoint;
      // special cases for special endpoints
      if (endpoint.includes("{SLACK_ID}")) {
        endpoint = endpoint.replace("{SLACK_ID}", slackId);
      }
      if (endpoint.includes("{YOUR_SECRET_TOKEN}")) {
        endpoint = endpoint.replace("{YOUR_SECRET_TOKEN}", accessToken);
      }
      if (endpoint.includes("{WAKATIME_API_KEY}")) {
        endpoint = endpoint.replace("{WAKATIME_API_KEY}", wakatimeApiKey);
      }
      if (endpoint.includes("{USER_ID}")) {
        endpoint = endpoint.replace("{USER_ID}", userId);
      }
      console.log(
        "Making API request to endpoint:",
        endpoint,
        "with ID:",
        msg.id,
      );
      console.log("Access Token:", accessToken);
      console.log("fetching from: https://hackatime.hackclub.com/" + endpoint);
      fetch("https://hackatime.hackclub.com/" + endpoint, {
        headers: {
          Authorization: `Bearer ${
            msg.useWakatimeAuth ? wakatimeApiKey : accessToken
          }`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            socket.emit("api_response" + msg.id, {
              error: `HTTP error! status: ${response.status}`,
              success: false,
              id: msg.id,
            });
            console.error(
              `HTTP error! status: ${response.status}. full response:. ID: ${msg.id}`,
            );
            throw new Error(
              `HTTP error! status: ${response.status}. full response:. ID: ${msg.id}`,
            );
          } else {
            return response.json();
          }
        })
        .then((data) => {
          console.log("API request successful with ID:", msg.id);
          socket.emit("api_response" + msg.id, {
            data,
            success: true,
            id: msg.id,
          });
        })
        .catch((error) => {
          console.error("Error fetching API data:", error);
          socket.emit("api_response" + msg.id, {
            error: "Failed to fetch API data",
            success: false,
            id: msg.id,
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
