import { Server } from "socket.io";
import { io } from "socket.io-client";
import { encryptToken, decryptToken } from "./hackatimeTokenEncryption.js";
import fs from "fs";
import { getApis } from "./allApiRequirements.js";
import "dotenv/config";
console.log("Starting server...");
const currentServer = process.env.CURRENT_SERVER;
const serverToServerSecret = process.env.SERVER_TO_SERVER_SECRET;
let hackatimeTokensJson;
let hackatimeTokens;
if (currentServer == "NA") {
  hackatimeTokensJson = fs.readFileSync("tokens.json", "utf8");

  // delete old tokens
  hackatimeTokens = JSON.parse(hackatimeTokensJson);
  // delete old tokens after boot
}
const hackameterApiToken = process.env.HACKATIME_SECRET;
let NAServer;
let recieveEUServer;
if (currentServer == "NA") {
  const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000); // 60 days in milliseconds
  setInterval(
    () => {
      for (const userId of Object.keys(hackatimeTokens)) {
        const tokenData = hackatimeTokens[userId];
        const timestamp = tokenData.timestamp;
        if (timestamp < sixtyDaysAgo.getTime()) {
          delete hackatimeTokens[userId];
        }
      }
    },
    24 * 60 * 60 * 1000,
  ); // run every 24 hours
  console.log("Starting server to recieve EU server connections...");
  recieveEUServer = new Server({
    path: "/nonNAServer/",
    cors: {
      origin: [
        "https://blxm-server.hackclub.app",
        "https://nest-api.blxm.me",
        "https://test-api.blxm.me",
      ],
    },
  });
} else if (currentServer == "EU") {
  NAServer = io("https://test-api.blxm.me", {
    path: "/nonNAServer",
    autoConnect: true,
    auth: {
      secret: serverToServerSecret,
    },
    transports: ["websocket"],
  });

  NAServer.on("connect", () => {
    console.log("Connected to NA server!", NAServer.id);
  });

  NAServer.on("connect_error", (error) => {
    console.error("Failed to connect to NA server:", error.message);
  });

  NAServer.on("disconnect", (reason) => {
    console.log("Disconnected from NA server:", reason);
  });
}

const server = new Server({
  path: "/hackameter/",
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://hackameter.blxm.me",
      "https://test-api.blxm.me",
      "https://hackameter-git-main-blxcodes-projects.vercel.app/",
      "https://hackameter.vercel.app",
      "http://192.168.0.17:5173",
    ],
  },
});
let currUsers = 0;

server.on("connection", (socket) => {
  let accessToken = null;
  let loginToken = null;
  let userId = null;
  let slackId = null;
  let wakatimeApiKey = null;
  socket.emit("alert", "Welcome to the HackaMeter!");
  console.log("a user connected", socket.id);
  console.log("ip:", socket.handshake.address);

  currUsers++;
  console.log("current users:", currUsers);

  // auth coming in from client handeling
  socket.on("auth", (msg) => {
    console.log("Received auth message from :", socket.id);
    function getWakatimeApiKey() {
      console.log("Fetching WakaTime API key for user:", userId);
      if (accessToken && userId) {
        fetch("https://hackatime.hackclub.com/api/v1/authenticated/api_keys", {
          headers: {
            Authorization: "Bearer " + accessToken,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            if (data) {
              wakatimeApiKey = data.token;
              console.log(
                "Successfully fetched WakaTime API key for user:",
                userId,
              );
              console.log("socket.id:", socket.id);
              socket.emit("auth_response", {
                success: true,
                loginToken: loginToken,
              });
            } else {
              console.error("No WakaTime API keys found for the user.");
              socket.emit("auth_response", {
                error: "No WakaTime API keys found for the user.",
                success: false,
              });
            }
          })
          .catch((error) => {
            console.error("Error fetching WakaTime API key:", error);
          });
      } else {
        console.error(
          "Access token or user ID not available for WakaTime API key request.",
        );
        socket.emit("auth_response", {
          error:
            "Access token or user ID not available for WakaTime API key request.",
          success: false,
        });
      }
    }
    // my way
    if (
      msg.loginToken != null &&
      msg.loginToken != undefined &&
      msg.loginToken != "" &&
      msg.loginToken
    ) {
      // if login token is present, decrypt it and check if it is valid
      const decryptedToken = decryptToken(msg.loginToken);
      if (decryptedToken) {
        const [userIdFromToken, emailFromToken] = decryptedToken.split(":");
        if (currentServer == "NA") {
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
            getWakatimeApiKey();
          } else {
            console.error("Invalid login token provided.");
            socket.emit("auth_response", {
              error: "Invalid login token",
              success: false,
            });
            return;
          }
        } else if (currentServer == "EU") {
          console.log("Sending login token to NA server for validation...");
          NAServer.emit("check_login_token", {
            loginToken: msg.loginToken,
            socketId: socket.id,
          });
          NAServer.on("login_token_response", (response) => {
            if (response.success) {
              accessToken = decryptToken(response.hackatimeToken);
              userId = response.userId;
              console.log(
                "Successfully authenticated with Login Token. Redirecting to portal...",
              );
              getWakatimeApiKey();
            } else {
              console.error("Invalid login token provided. ");
              socket.emit("auth_response", {
                error: "Invalid login token",
                success: false,
              });
              return;
            }
          });
        }
      } else {
        console.error("Failed to decrypt the login token.");
        socket.emit("auth_response", {
          error: "Failed to decrypt the login token",
          success: false,
        });
        return;
      }
    } // hackatime
    else if (
      (msg.code && msg.uri) ||
      msg.loginToken == null ||
      msg.loginToken == undefined
    ) {
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
            socket.emit("auth_response", {
              error: data.error,
              success: false,
            });
          } else {
            // IF SUCCESSFUL, STORE ACCESS TOKEN
            if (
              data.scope == "profile read" &&
              data.access_token &&
              data.token_type == "Bearer"
            ) {
              if (
                data.access_token == null ||
                data.access_token == undefined ||
                data.access_token == ""
              ) {
                console.error("Access token is null or undefined.");
                socket.emit("auth_response", {
                  error: "Access token is null or undefined",
                  success: false,
                });
                return;
              }

              data.access_token ? (accessToken = data.access_token) : null;
              accessToken = data.access_token ? data.access_token : accessToken;
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
                      if (currentServer == "NA") {
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
                      } else if (currentServer == "EU") {
                        NAServer.emit("update_tokens", {
                          userId: userId,
                          loginToken: loginToken,
                          hackatimeToken: encryptToken(accessToken),
                          timestamp: Date.now(),
                        });
                      }
                      getWakatimeApiKey();
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
      const clientInfo = {
        userId: userId,
        accessToken: accessToken,
        slackId: slackId,
        wakatimeApiKey: wakatimeApiKey,
      };
      getApis(clientInfo, msg.apiName).then((result) => {
        if (result.status === "success") {
         
          socket.emit("api_response" + msg.id, {
            success: true,
            data: result.data,
          });
        } else if (result.status === "error") {
          console.error(
            "API request",
            msg.apiName,
            " failed for user:",
            userId,
            "Error:",
            result.error,
            "Details:",
            result.details,
          );
          socket.emit("api_response" + msg.id, {
            success: false,
            error: result.error,
            details: result.details,
          });
        }
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    currUsers--;
    console.log("current users:", currUsers);
  });
});

if (currentServer == "NA") {
  recieveEUServer.on("connection", (socket) => {
    console.log("EU server connected:", socket.id);
    if (socket.handshake.auth.secret !== serverToServerSecret) {
      console.error("Invalid secret from EU server. Disconnecting...");
      socket.disconnect();
      return;
    }
    socket.on("check_login_token", (msg) => {
      const { loginToken } = msg;
      const decryptedToken = decryptToken(loginToken);
      if (decryptedToken) {
        const [userIdFromToken, emailFromToken] = decryptedToken.split(":");
        if (hackatimeTokens[userIdFromToken]) {
          const hackatimeToken =
            hackatimeTokens[userIdFromToken].hackatimeToken;
          console.log(
            "Sending userid response to EU server for user:",
            userIdFromToken,
          );
          recieveEUServer.to(socket.id).emit("login_token_response", {
            success: true,
            hackatimeToken: hackatimeToken,

            userId: userIdFromToken,
          });
        } else {
          console.error(
            "Invalid login token provided from EU server.",
            decryptedToken,
          );
          recieveEUServer.to(socket.id).emit("login_token_response", {
            success: false,
            error: "Invalid login token",
          });
        }
      } else {
        recieveEUServer.to(socket.id).emit("login_token_response", {
          success: false,
          error: "Failed to decrypt the login token",
        });
        console.error(
          "Failed to decrypt the login token from EU server.",
          loginToken,
        );
      }
    });

    socket.on("update_tokens", (msg) => {
      const { userId, loginToken, hackatimeToken, timestamp } = msg;
      hackatimeTokens[userId] = {
        userId,
        loginToken,
        hackatimeToken,
        timestamp,
      };
      fs.writeFileSync("tokens.json", JSON.stringify(hackatimeTokens, null, 2));
    });
  });
  recieveEUServer.listen(3067);
}

server.listen(3068);
