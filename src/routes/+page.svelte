<script lang="ts">
	//TODO: put this in a shared types file that the scripts also access
	import textBlocksJson from './text_blocks_with_embeddings.json';
	interface TextBlock {
		id: number;
		title: string;
		content: string;
		channelSlug: string;
		embedding: number[];
	}

	console.log(textBlocksJson);
	let textBlocks: TextBlock[] = $state(textBlocksJson as TextBlock[]);

	let lastClickedIndex: number | null = null;

	function shuffleQuotes(excludeId: number) {
		const clickedIndex = textBlocks.findIndex((q) => q.id === excludeId);
		if (lastClickedIndex == clickedIndex) {
			return;
		}
		lastClickedIndex = clickedIndex;
		const otherQuotes = textBlocks.filter((q) => q.id !== excludeId);
		const clickedQuote = textBlocks[clickedIndex];

		// Fisher-Yates shuffle algorithm
		for (let i = otherQuotes.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[otherQuotes[i], otherQuotes[j]] = [otherQuotes[j], otherQuotes[i]];
		}

		// Insert the clicked quote back at its original position
		otherQuotes.splice(clickedIndex, 0, clickedQuote);
		textBlocks = otherQuotes;
	}
</script>

<div class="sticky-board">
	{#each textBlocks as quote (quote.id)}
		<button
			class="sticky-note"
			onclick={() => shuffleQuotes(quote.id)}
			style="--rotation: {Math.random() * 6 - 3}deg; --color: {[
				'#ffd700',
				'#ff7eb9',
				'#90ee90',
				'#87ceeb'
			][Math.floor(Math.random() * 4)]}"
		>
			<p class="quote-text">"{quote.content}"</p>
			<p class="quote-title">- {quote.title}</p>
		</button>
	{/each}
</div>

<style>
	:root {
		--sticky-size: 350px;
	}

	.sticky-board {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(var(--sticky-size), 1fr));
		gap: 2rem;
		padding: 2rem;
		background: #f5f5f5;
		min-height: 100vh;
	}

	.sticky-note {
		background: var(--color);
		padding: 1.5rem;
		border-radius: 2px;
		box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.1);
		transform: rotate(var(--rotation));
		transition: transform 0.2s ease;
		width: var(--sticky-size);
		height: var(--sticky-size);
	}

	.sticky-note:hover {
		transform: rotate(0deg) scale(1.05);
	}

	.quote-text {
		font-size: 1.1rem;
		margin-bottom: 1rem;
		font-family: 'Courier New', Courier, monospace;
	}

	.quote-title {
		font-style: italic;
		text-align: right;
		color: #666;
	}
</style>
