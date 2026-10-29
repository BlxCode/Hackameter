<script>
  import {
    hackatimeData,
    apiRequest,
    socket,
    authenticated,
  } from "./main.svelte";
  const userName = $state({ data: "Username Not Found" });
  let imageSrc = $state(
    "https://www.blxm.me/_app/immutable/assets/kakaReder.Dh_f2OKQ.png",
  );
  console.log("Socket in header.svelte:", socket);

  $effect(() => {
    if (socket.connected && authenticated.value) {
      if (authenticated.value) {
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
      }
    }
  });
</script>

<nav>
  <div
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
  </div>
  <small>Stats</small>
  <ul>
    <li><a href="#top">Top</a></li>
    <li><a href="#overview">Overview</a></li>
  </ul>
  <div
    id="portal-header-buttons"
    style="display: flex; flex-direction: column; gap: 0.5rem; margin-top: 1rem;"
  >
    <small>Options</small>
    <ul>
      <li><button class="secondary">Settings</button></li>
      <li><button class="outline secondary">Logout</button></li>
    </ul>
  </div>
</nav>

<style>
  @media (width <= 768px) {
    #portal-header-buttons {
      display: block !important;
    }
  }
  @media (width > 768px) {
    #portal-header-buttons {
      display: none !important;
    }
  }
  nav {
    padding: 1rem;
    color: white;
    font-family: "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif;
    text-align: left;
  }
</style>
