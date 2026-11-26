<script>
  import { hackatimeData } from "./main.svelte";

</script>
<div style="padding:1rem; text-align:center; width:100%; padding-left:1.5rem; padding-right:1.5rem;">
<h2>Create New Big Goal!</h2><br>
<p>Info: Goals should be SMART (Specific, Measurable, Achievable, Relevant, Time-bound).</p><br>
<form>
<div style="display:flex; flex-direction: row; row-gap: 0.05rem; column-gap: 0.4rem; flex-wrap: wrap; margin:auto; max-width:45.5rem; justify-content:center; text-align:center;">
<label for="goalName" style="max-width:10rem;">
  Goal Name*
  <input id="goalName" type="text" name="goalName" placeholder="My Goal" maxlength="16" required />
</label>
<label for="goalDescription" style="max-width:40rem;">
  Goal Short Description
  <input id="goalDescription" type="text" name="goalDescription" placeholder="Very good goal!" maxlength="40" />
</label>


</div>
<div style="display:flex; flex-direction: row; row-gap: 0.05rem; column-gap: 0.4rem; flex-wrap: wrap; margin:auto; max-width:45.5rem; justify-content:center; text-align:center;">
<p style="margin:auto 1rem; padding:auto;">I want to code</p>
    <label for="goalAmount" style="max-width:7.5rem;">
Amount*
  <input id="goalAmount" type="number" name="goalAmount" placeholder="67" max="1000" min="1" required />
</label>

<p style="margin:auto 1rem; padding:auto;">hours before</p>
<label for="date" style="max-width:12rem;">
  Date
  <input id="date" type="date" name="date" />
</label>




</div>



</form>
</div>