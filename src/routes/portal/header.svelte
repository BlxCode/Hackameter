
<script>
  import { hackatimeData } from "./main.svelte";
  let { menuClicked = $bindable(false) } = $props();
  let xpAmt = $state()
if (hackatimeData.customData && hackatimeData.customData.points) {
  xpAmt = hackatimeData.customData.points;
} else {
  xpAmt = 0;
}

function logout() {
  sessionStorage.removeItem("loginToken");
  location.reload();
}
</script>
<div style="width: fit-content;">
<button onclick = {() => { menuClicked = !menuClicked; }}  id="menu" class="secondary" style="margin:0.5rem; display:none;">Menu</button>
    <h1 style="margin-top:auto;margin-bottom:auto;">HackaMeter</h1>
  <div style=" position: absolute; right: 1rem; display: flex; gap: 0.5rem;" id="portal-header-buttons">
  <button style="cursor:default;">
   {xpAmt} Points
  </button>
    <button class="outline secondary" onclick={logout}>Logout</button>
  </div>
</div>

<style>
@media (width <= 1000px) {
  #portal-header-buttons {
    display: none !important;
  }
  #menu {
    display: block !important;
  }
}
  div {
    display: flex;
    align-items: center;
    padding: 0.5rem;
    color: white;
  }
</style>
