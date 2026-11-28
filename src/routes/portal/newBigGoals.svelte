<script>
  import { hackatimeData } from "./main.svelte";
  import { socket } from "./initiateSocket.svelte";

  function attemptCreateBigGoal() {
    const goalInputs = {
      name: document.getElementById("goalName"),
      description: document.getElementById("goalDescription"),
      amount: document.getElementById("goalAmount"),
      date: document.getElementById("date"),
    };
    const goalInfo = {
      name: goalInputs.name.value,
      description: goalInputs.description.value,
      amount: goalInputs.amount.value,
      date: goalInputs.date.value,
    };
    const goalRequirements = {
      name: { required: true, minLength: 3, maxLength: 16 },
      description: { required: false, maxLength: 40 },
      amount: { required: true, min: 1, max: 5000 },
      date: { required: true },
    };
    for (const input in goalInfo) {
      checkInputs(input);
    }

    function checkInputs(input) {
      if (
        goalInfo[input].length < goalRequirements[input].minLength ||
        goalInfo[input].length > goalRequirements[input].maxLength ||
        goalInfo[input] < goalRequirements[input].min ||
        goalInfo[input] > goalRequirements[input].max
      ) {
        goalInputs[input].ariaInvalid = "true";
      } else {
        goalInputs[input].ariaInvalid = "false";
      }
      if (goalRequirements[input].required && !goalInfo[input]) {
        goalInputs[input].ariaInvalid = "true";
        // check if before date is before today
        if (goalInfo.date) {
          const date = new Date(goalInfo.date);
          const today = new Date();
          if (date > today) {
            goalInputs.date.ariaInvalid = "true";
          } else {
            goalInputs.date.ariaInvalid = "false";
          }
        }
      }
    }
  }
</script>

<div
  style="padding:1rem; text-align:center; width:100%; padding-left:1.5rem; padding-right:1.5rem;"
>
  <h2>Create New Big Goal!</h2>
  <br />
  <p>
    Info: Goals should be SMART (Specific, Measurable, Achievable, Relevant,
    Time-bound).
  </p>
  <br />
  <form>
    <div
      style="display:flex; flex-direction: row; row-gap: 0.05rem; column-gap: 0.4rem; flex-wrap: wrap; margin:auto; max-width:45.5rem; justify-content:center; text-align:center;"
    >
      <label for="goalName" style="max-width:10rem;">
        Goal Name*
        <input
          id="goalName"
          type="text"
          name="goalName"
          placeholder="My Goal"
          maxlength="16"
          required
        />
      </label>
      <label for="goalDescription" style="max-width:40rem;">
        Goal Short Description
        <input
          id="goalDescription"
          type="text"
          name="goalDescription"
          placeholder="Very good goal!"
          maxlength="40"
        />
      </label>
    </div>
    <div
      style="display:flex; flex-direction: row; row-gap: 0.05rem; column-gap: 0.4rem; flex-wrap: wrap; margin:auto; max-width:45.5rem; justify-content:center; text-align:center;"
    >
      <p style="margin:auto 1rem; padding:auto;">I want to code</p>
      <label for="goalAmount" style="max-width:7.5rem;">
        Amount*
        <input
          id="goalAmount"
          type="number"
          name="goalAmount"
          placeholder="67"
          max="5000"
          min="1"
          required
        />
      </label>

      <p style="margin:auto 1rem; padding:auto;">hours before</p>
      <label for="date" style="max-width:12rem;">
        Date*
        <input id="date" type="date" name="date" required />
      </label>
    </div>
    <button
      type="button"
      onclick={attemptCreateBigGoal}
      style="margin-top:1rem;">Create Goal</button
    >
  </form>
</div>
