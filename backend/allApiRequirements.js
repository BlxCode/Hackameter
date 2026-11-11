const today = new Date();
const todayString = today.toISOString().split("T")[0];
const sevenDaysAgo = new Date(today);
sevenDaysAgo.setDate(today.getDate() - 7);
const sevenDaysAgoString = sevenDaysAgo.toISOString().split("T")[0];
const fourteenDaysAgo = new Date(today);
fourteenDaysAgo.setDate(today.getDate() - 14);
const fourteenDaysAgoString = fourteenDaysAgo.toISOString().split("T")[0];
const twentyOneDaysAgo = new Date(today);
twentyOneDaysAgo.setDate(today.getDate() - 21);
const twentyOneDaysAgoString = twentyOneDaysAgo.toISOString().split("T")[0];

const apiUrls = {
  dashboard: [
    "api/v1/users/{USER_ID}/stats?start_date=&end_date=&limit=1&features=&filter_by_project=&filter_by_category=&boundary_aware=true&total_seconds=true&no_ai_coding=false&test_param=false",
    "api/hackatime/v1/users/{USER_ID}?api_key={WAKATIME_API_KEY}",
    "api/v1/authenticated/streak",
    "api/hackatime/v1/users/current/stats/last_7_days?api_key={YOUR_SECRET_TOKEN}",
    "api/hackatime/v1/users/{USER_ID}/statusbar/today?api_key={YOUR_SECRET_TOKEN}",
    "api/summary?start=&end=&user_id={USER_ID}",
    "api/v1/authenticated/hours?start_date=${fourteenDaysAgoString}&end_date=${sevenDaysAgoString}",
    "api/v1/authenticated/hours?start_date=${twentyOneDaysAgoString}&end_date=${fourteenDaysAgoString}",
  ],
  aboutUser: ["api/v1/authenticated/me"],
};
const stupidOutlierLists = {
  "api/v1/authenticated/me": { authorization: "Bearer {YOUR_SECRET_TOKEN}" },
  "api/v1/authenticated/streak": {
    authorization: "Bearer {YOUR_SECRET_TOKEN}",
  },
  "api/v1/authenticated/hours?start_date=${fourteenDaysAgoString}&end_date=${sevenDaysAgoString}":
    { authorization: "Bearer {YOUR_SECRET_TOKEN}" },
  "api/v1/authenticated/hours?start_date=${twentyOneDaysAgoString}&end_date=${fourteenDaysAgoString}":
    { authorization: "Bearer {YOUR_SECRET_TOKEN}" },
};
export async function getApis(clientInfo, apiName) {
  if (
    clientInfo.userId &&
    clientInfo.userId !== "undefined" &&
    clientInfo.userId !== null
  ) {
    if (apiName) {
      async function fetchApiData(apiUrl) {
        console.log("attempting to fetch API data from:", apiUrl);
        const realApiUrl = apiUrl
          .replace("{USER_ID}", clientInfo.userId)
          .replace("{WAKATIME_API_KEY}", clientInfo.wakatimeApiKey)
          .replace("{YOUR_SECRET_TOKEN}", clientInfo.accessToken)
          .replace("{USER_ID}", clientInfo.userId)
          .replace("{fourteenDaysAgoString}", fourteenDaysAgoString)
          .replace("{sevenDaysAgoString}", sevenDaysAgoString)
          .replace("{twentyOneDaysAgoString}", twentyOneDaysAgoString);
        let authorizationHeader = `Bearer ${clientInfo.wakatimeApiKey}`;

        if (stupidOutlierLists[apiUrl]) {
          if (stupidOutlierLists[apiUrl].authorization) {
            authorizationHeader = stupidOutlierLists[apiUrl].authorization
              .replace("{YOUR_SECRET_TOKEN}", clientInfo.accessToken)
              .replace("{WAKATIME_API_KEY}", clientInfo.wakatimeApiKey)
              .replace("{USER_ID}", clientInfo.userId)
              .replace("{fourteenDaysAgoString}", fourteenDaysAgoString)
              .replace("{sevenDaysAgoString}", sevenDaysAgoString)
              .replace("{twentyOneDaysAgoString}", twentyOneDaysAgoString);
          }
        }
        return fetch("https://hackatime.hackclub.com/" + realApiUrl, {
          headers: {
            Authorization: authorizationHeader,
          },
        })
          .then((response) => {
            if (!response.ok) {
              console.error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then((data) => {
            console.log("Fetched API data from:", apiUrl);
            return { status: "success", data: data };
          })
          .catch((error) => {
            return {
              status: "error",
              error: "Failed to fetch API data.",
              details: error.message,
            };
          });
      }
      const apiDataFetched = {};
      for (const apiUrl of apiUrls[apiName]) {
        const result = await fetchApiData(apiUrl);
        if (result.status == "success") {
          apiDataFetched[apiUrl] = result.data;
        } else {
          apiDataFetched[apiUrl] = {
            error: result.error,
            details: result.details,
          };
        }
      }
      return {
        status: "success",
        data: apiDataFetched,
      };
    } else {
      return {
        status: "bruh",
        error: "User info is not defined or invalid.",
      };
    }
  }
}
