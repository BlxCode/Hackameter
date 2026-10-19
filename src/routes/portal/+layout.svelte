<script>
	import '../layout.css';
	import STONKS from '#lib/assets/STONKS.png';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={STONKS} />
	<title>HackaMeter Portal</title>
</svelte:head>
<svelte:body />

	

{@render children()}
