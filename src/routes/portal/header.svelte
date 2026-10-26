<script>
import { hackatimeData, apiRequest, socket } from "./main.svelte";
apiRequest("users/{USER_ID}?api_key={YOUR_SECRET_TOKEN}");
let userName = $state("Blxm");
</script>
<div>
  <h1>HackaMeter</h1>
  

</div>
<div>
 <img src="path/to/image.jpg" alt="User Image" /> <h3>{userName}</h3>

</div>

<style>
  div {
    display: flex;
    background-color: #151618;
  }
</style>
