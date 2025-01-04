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
	let lastClickedTextBlock: TextBlock | null = null;

	function cosineSimilarity(a: number[], b: number[]): number {
		if (a.length !== b.length) {
			throw new Error('Vectors must have same length');
		}

		let dotProduct = 0;
		let normA = 0;
		let normB = 0;

		for (let i = 0; i < a.length; i++) {
			dotProduct += a[i] * b[i];
			normA += a[i] * a[i];
			normB += b[i] * b[i];
		}

		return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
	}

	function findSimilarTextBlocks(textBlock: TextBlock, n: number = 30) {
		// returns similar text blocks to the input textBlock. includes input textBlock as the first element of that array
		const similarities = textBlocks
			.map((other) => ({
				textBlock: other,
				similarity: cosineSimilarity(textBlock.embedding, other.embedding)
			}))
			.sort((a, b) => b.similarity - a.similarity)
			.slice(0, n + 1);
		return similarities.map((s) => s.textBlock);
	}

	function onClickTextBlock(textBlock: TextBlock) {
		if (lastClickedTextBlock === textBlock) {
			return;
		}
		lastClickedTextBlock = textBlock;
		textBlocks = findSimilarTextBlocks(textBlock);
	}
</script>

<div class="sticky-board">
	{#each textBlocks as textBlock (textBlock.id)}
		<button
			class="sticky-note"
			onclick={() => onClickTextBlock(textBlock)}
			style="--rotation: {Math.random() * 6 - 3}deg; --color: {[
				'#ffd700',
				'#ff7eb9',
				'#90ee90',
				'#87ceeb'
			][Math.floor(Math.random() * 4)]}"
		>
			<p class="quote-text">"{textBlock.content}"</p>
			<p class="quote-title">- {textBlock.title}</p>
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
