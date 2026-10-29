
<script>
  let { menuClicked = $bindable(false) } = $props();

</script>
<div style="width: fit-content;">
<button onclick = {() => { menuClicked = !menuClicked; }}  id="menu" class="secondary" style="margin:0.5rem; display:none;">Menu</button>
    <h1 style="margin-top:auto;margin-bottom:auto;">HackaMeter</h1>
  <div style=" position: absolute; right: 1rem; display: flex; gap: 0.5rem;" id="portal-header-buttons">
    <button class="secondary">Settings</button>
    <button class="outline secondary">Logout</button>
  </div>
</div>

<style>
@media (width <= 768px) {
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
