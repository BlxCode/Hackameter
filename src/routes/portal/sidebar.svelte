<script>
  import {
    hackatimeData,
    apiRequest,
    socket,
    authenticated,
  } from "./main.svelte";
  const userName = $state({ data: "Username Not Found" });
  let { changeDashboard, currentDashboard } = $props();

  let imageSrc = $state(
    "https://www.blxm.me/_app/immutable/assets/kakaReder.Dh_f2OKQ.png",
  );
  console.log("Socket in header.svelte:", socket);

  $effect(() => {
    if (socket.connected && authenticated.value) {
      if (authenticated.value) {
        apiRequest(
          "api/v1/users/{USER_ID}/stats?start_date=&end_date=&limit=1&features=&filter_by_project=&filter_by_category=&boundary_aware=true&total_seconds=true&no_ai_coding=false&test_param=false",
          true,
        ).then((apiId) => {
          console.log("API request sent with ID:", apiId);
          if (apiId) {
            if (hackatimeData.apiRequests[apiId].success) {
              console.log("toltal time:", hackatimeData.data[apiId]);
              hackatimeData.simpleData["totalTime"] =
                hackatimeData.data[apiId].total_seconds;
            } else {
              console.error(
                "API request failed:",
                hackatimeData.apiRequests[apiId].error,
              );
            }
          }
        });

        apiRequest(
          "api/hackatime/v1/users/{USER_ID}?api_key={WAKATIME_API_KEY}",
          true,
        ).then((apiId) => {
          console.log("API request sent with ID:", apiId);
          if (apiId) {
            if (hackatimeData.apiRequests[apiId].success) {
              console.log("API request successful:", hackatimeData.data[apiId]);
              userName.data = hackatimeData.data[apiId].data.display_name;
              hackatimeData.simpleData["userName"] =
                hackatimeData.data[apiId].data.display_name;

              imageSrc = hackatimeData.data[apiId].data.photo;
              console.log("User Name:", userName);
              console.log("Image Source:", imageSrc);
            } else {
              console.error(
                "API request failed:",
                hackatimeData.apiRequests[apiId].error,
              );
            }
          }
        });

        apiRequest("api/v1/authenticated/streak", false).then((apiId) => {
          console.log("API request sent with ID:", apiId);
          if (apiId) {
            if (hackatimeData.apiRequests[apiId].success) {
              console.log("streak:", hackatimeData.data[apiId]);
              hackatimeData.simpleData["streak"] =
                hackatimeData.data[apiId].streak_days;
            } else {
              console.error(
                "API request failed:",
                hackatimeData.apiRequests[apiId].error,
              );
            }
          }
        });

        apiRequest(
          "api/hackatime/v1/users/current/stats/last_7_days?api_key={YOUR_SECRET_TOKEN}",
          true,
        ).then((apiId) => {
          console.log("API request sent with ID:", apiId);
          if (apiId) {
            if (hackatimeData.apiRequests[apiId].success) {
              console.log("summary:", hackatimeData.data[apiId]);

              hackatimeData.simpleData["last7DaysAverage"] =
                hackatimeData.data[apiId].data.daily_average;
              hackatimeData.simpleData["last7DaysTotal"] =
                hackatimeData.data[apiId].data.total_seconds;

              hackatimeData.simpleData["last7DaysProjects"] =
                hackatimeData.data[apiId].data.projects;
              hackatimeData.simpleData["last7DaysCategories"] =
                hackatimeData.data[apiId].data.categories;
              hackatimeData.simpleData["last7DaysLanguages"] =
                hackatimeData.data[apiId].data.languages;
              hackatimeData.simpleData["last7DaysEditors"] =
                hackatimeData.data[apiId].data.editors;
                
            } else {
              console.error(
                "API request failed:",
                hackatimeData.apiRequests[apiId].error,
              );
              if (
                hackatimeData.apiRequests[apiId].error ==
                "HTTP error! status: 403"
              ) {
                alert(
                  "Please make sure you allowed public access lookup to your HackaTime data in your HackaTime privacy settings. If you have already done that, please try again later.",
                );
              }
            }
          }
        });

        apiRequest(
          "api/hackatime/v1/users/{USER_ID}/statusbar/today?api_key={YOUR_SECRET_TOKEN}",
          true,
        ).then((apiId) => {
          console.log("API request sent with ID:", apiId);
          if (apiId) {
            if (hackatimeData.apiRequests[apiId].success) {
              console.log("today time:", hackatimeData.data[apiId]);
              hackatimeData.simpleData["todayTime"] =
                hackatimeData.data[apiId].data.grand_total.total_seconds;
              hackatimeData.simpleData["todayGoalTarget"] =
                hackatimeData.data[apiId].data.goal.target_seconds;
            
            } else {
              console.error(
                "API request failed:",
                hackatimeData.apiRequests[apiId].error,
              );
            }
          }
        });
      }
    }
  });
</script>

<nav>
  <section
    aria-label="User Info"
    style="width: fit-content; display: flex; align-items: center; margin-bottom: 1rem;"
  >
    <img
      src={imageSrc}
      alt="User Image"
      width="45"
      height="45"
      style="border-radius: 50%;"
      draggable="false"
    />
    <h3 style="margin-top: auto; margin-bottom:auto; margin-left: 0.5rem;">
      {userName.data}
    </h3>
  </section>
  <section aria-label="Stats">
    <small>Stats</small>
    <ul>
      <li>
        <a
          href=""
          aria-current={currentDashboard === "overview" ? "page" : "none"}
          class={currentDashboard === "overview" ? "outline" : ""}
          onclick={(e) => changeDashboard("overview")}>Overview</a
        >
      </li>
      <li>
        <a
          href=""
          aria-current={currentDashboard === "achievements" ? "page" : "none"}
          class={currentDashboard === "achievements" ? "outline" : ""}
          onclick={(e) => changeDashboard("achievements")}>Achievements</a
        >
      </li>
    </ul>
  </section>
  <section
    aria-label="Options"
    id="portal-header-buttons"
    style="display: flex; flex-direction: column; gap: 0.5rem; margin-top: 1rem;"
  >
    <small>Options</small>
    <ul>
      <li><button class="secondary">Settings</button></li>
      <li><button class="outline secondary">Logout</button></li>
    </ul>
  </section>
</nav>

<style>
  @media (width <= 1000px) {
    #portal-header-buttons {
      display: block !important;
    }
  }
  @media (width > 1000px) {
    #portal-header-buttons {
      display: none !important;
    }
  }
  nav {
    padding: 1rem;
    text-align: left;
  }
  nav a {
    cursor: pointer;
    transition:
      border-color background-color 0.2s ease,
      color 0.2s ease;
    border: 1px solid transparent;
  }

  nav a:hover {
    border-color: var(--pico-primary-background);
    color: var(--pico-primary);
    text-decoration: none;
  }
  nav a.outline {
    background-color: var(--pico-text-selection-color);

    color: var(--pico-primary);
  }
</style>
