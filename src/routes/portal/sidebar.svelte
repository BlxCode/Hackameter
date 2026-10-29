<script>
  import {
    hackatimeData,
    apiRequest,
    socket,
    authenticated,
  } from "./main.svelte";
  let userName = $state("Username Not Found");
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
              userName = hackatimeData.data[apiId].data.display_name;

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
<div style="width: fit-content; display: flex; align-items: center; margin-bottom: 1rem;">
  <img src={imageSrc} alt="User Image" width="45" height="45" style="border-radius: 50%;" draggable="false" />
  <h3 style="margin-top: auto; margin-bottom:auto; margin-left: 0.5rem;">
    {userName}
  </h3>
</div>
<small>Stats</small>
    <ul>
        <li><a href="#top">Top</a></li>
        <li><a href="#overview">Overview</a></li>
    </ul>
</nav>

<style>
    nav {
        padding: 1rem;
        color: white;
        font-family: "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif;
        text-align: left;
    }
</style>