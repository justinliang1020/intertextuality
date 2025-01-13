<script lang="ts">
	let {
		text,
		title,
		source,
		hiddenUntilHover
	}: { text: string; title: string; source?: string; hiddenUntilHover?: boolean } = $props();

	// what if text is too big for box, make an expand ?
</script>

<div class="container" class:hidden-until-hover={hiddenUntilHover}>
	<div class="text-block">
		<p class="text">{text}</p>
	</div>
	<div class="footer">
		<span class="title"><i>{title}</i></span>
		{#if source}
			<!-- content here -->
			<a href={source} class="source-link" aria-label="Source link">
				<svg
					width="12"
					height="12"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
					<polyline points="15 3 21 3 21 9"></polyline>
					<line x1="10" y1="14" x2="21" y2="3"></line>
				</svg>
			</a>
		{/if}
	</div>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
		width: 400px;
		height: 400px;
	}

	.text-block {
		width: 100%;
		height: 100%;
		background-color: #1a1a1a;
		border: 1px solid #333;
		padding: 1rem;
		box-sizing: border-box;
	}

	.text {
		font-family: 'Georgia', serif;
		font-size: 1rem;
		line-height: 1.6;
		margin: 0;
		width: 100%;
	}

	.footer {
		display: flex;
		justify-content: center;
		width: 100%;
		gap: 0.5rem;
		padding-left: 0.25rem;
		margin-bottom: 1rem;
	}

	.title {
		font-family: 'Georgia', serif;
		font-size: 0.875rem;
		color: #999;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}

	.source-link {
		color: #999;
		display: inline-flex;
		align-items: center;
		transition: color 0.2s ease;
	}

	.source-link:hover {
		color: #e0e0e0;
	}

	.hidden-until-hover {
		color: transparent;
	}

	.hidden-until-hover:hover {
		color: white;
	}

	.hidden-until-hover:focus {
		color: white;
	}
</style>
