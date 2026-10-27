<script>
  import { hackatimeData, apiRequest, socket } from "./main.svelte";
  let userName = $state("Blxm");

  socket.on("auth_response", (data) => {
    if (data.success) {
      apiRequest("api/hackatime/v1/users/{USER_ID}?api_key={WAKATIME_API_KEY}",true).then(
        (apiId) => {
          console.log("API request sent with ID:", apiId);
          if (apiId) {
            if (hackatimeData.apiRequests[apiId].success) {
              console.log("API request successful:", hackatimeData.data[apiId]);
            } else {
              console.error(
                "API request failed:",
                hackatimeData.apiRequests[apiId].error,
              );
            }
          }
        },
      );
    }
  });
</script>

<div>
  <h1>HackaMeter</h1>
</div>
<div>
  <img src="path/to/image.jpg" alt="User Image" />
  <h3>{userName}</h3>
</div>

<style>
  div {
    display: flex;
    background-color: #151618;
  }
</style>
