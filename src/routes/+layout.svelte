<script>
	let { children } = $props();
</script>

{@render children()}

<style>
	:global(a) {
		color: rgb(136, 163, 232);
	}
	:global(body) {
		color: rgb(248, 249, 250);
		background-color: rgb(32, 33, 34);
	}
</style>
