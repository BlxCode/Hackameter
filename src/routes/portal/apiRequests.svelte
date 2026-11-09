<script>
  import {
    hackatimeData,
    apiRequest,
    socket,
    authenticated,
    dashboardCurrentlyShown,
  } from "./main.svelte";
  let apisAllFetched = $state(false);
  $effect(() => {
    if (socket.connected && authenticated.value && !apisAllFetched) {
      apiRequest("dashboard").then((apiId) => {
        console.log("API request sent with ID:", apiId);
        if (apiId) {
          if (hackatimeData.apiRequests[apiId].success) {
            console.log("toltal time:", hackatimeData.data[apiId]);
            hackatimeData.simpleData["totalTime"] =
              hackatimeData.data[apiId][
                "api/v1/users/{USER_ID}/stats?start_date=&end_date=&limit=1&features=&filter_by_project=&filter_by_category=&boundary_aware=true&total_seconds=true&no_ai_coding=false&test_param=false"
              ].total_seconds;

            hackatimeData.simpleData["userName"] =
              hackatimeData.data[apiId][
                "api/hackatime/v1/users/{USER_ID}?api_key={WAKATIME_API_KEY}"
              ].data.display_name;

      hackatimeData.simpleData["photo"] =
              hackatimeData.data[apiId][
                "api/hackatime/v1/users/{USER_ID}?api_key={WAKATIME_API_KEY}"
              ].data.photo;

            hackatimeData.simpleData["streak"] =
              hackatimeData.data[apiId][
                "api/v1/authenticated/streak"
              ].streak_days;

            hackatimeData.simpleData["last7DaysAverage"] =
              hackatimeData.data[apiId][
                "api/hackatime/v1/users/current/stats/last_7_days?api_key={YOUR_SECRET_TOKEN}"
              ].data.daily_average;

            hackatimeData.simpleData["last7DaysTotal"] =
              hackatimeData.data[apiId][
                "api/hackatime/v1/users/current/stats/last_7_days?api_key={YOUR_SECRET_TOKEN}"
              ].data.total_seconds;

            hackatimeData.simpleData["last7DaysProjects"] =
              hackatimeData.data[apiId][
                "api/hackatime/v1/users/current/stats/last_7_days?api_key={YOUR_SECRET_TOKEN}"
              ].data.projects;

            hackatimeData.simpleData["last7DaysCategories"] =
              hackatimeData.data[apiId][
                "api/hackatime/v1/users/current/stats/last_7_days?api_key={YOUR_SECRET_TOKEN}"
              ].data.categories;

            hackatimeData.simpleData["last7DaysLanguages"] =
              hackatimeData.data[apiId][
                "api/hackatime/v1/users/current/stats/last_7_days?api_key={YOUR_SECRET_TOKEN}"
              ].data.languages;

            hackatimeData.simpleData["last7DaysEditors"] =
              hackatimeData.data[apiId][
                "api/hackatime/v1/users/current/stats/last_7_days?api_key={YOUR_SECRET_TOKEN}"
              ].data.editors;

            hackatimeData.simpleData["todayTime"] =
              hackatimeData.data[apiId][
                "api/hackatime/v1/users/{USER_ID}/statusbar/today?api_key={YOUR_SECRET_TOKEN}"
              ].data.grand_total.total_seconds;

            hackatimeData.simpleData["todayGoalTarget"] =
              hackatimeData.data[apiId][
                "api/hackatime/v1/users/{USER_ID}/statusbar/today?api_key={YOUR_SECRET_TOKEN}"
              ].data.goal.target_seconds;

            apisAllFetched = true;
          } else {
            console.error(
              "API request failed:",
              hackatimeData.apiRequests[apiId].error,
            );
          }
        }
      });
    }
  });
</script>
