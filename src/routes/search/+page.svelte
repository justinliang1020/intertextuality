<script lang="ts">
	import textBlocksJson from '../text_blocks_with_embeddings.json';
	import { pipeline } from '@huggingface/transformers';
	import type { FeatureExtractionPipeline } from '@huggingface/transformers';
	import { onMount } from 'svelte';
	import type { TextBlockWithEmbedding } from '$lib/types';

	let extractor: FeatureExtractionPipeline | null = $state(null);
	let allTextBlocks: TextBlockWithEmbedding[] = textBlocksJson;
	let searchInput = $state('');
	async function handleSubmitSearch() {
		if (!extractor) {
			console.error('extractor is not yet initialized');
			return;
		}
		const embeddings = (
			await extractor(searchInput, { pooling: 'mean', normalize: true })
		).tolist()[0];
		textBlocksWithSimilarity = findSimilarTextBlocks(embeddings, 50);
	}
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

	function findSimilarTextBlocks(
		embedding: number[],
		n: number = 30
	): (TextBlockWithEmbedding & { similarity: number })[] {
		// returns similar text blocks to the input textBlock. includes input textBlock as the first element of that array
		const similarities = allTextBlocks
			.map((other) => ({
				...other,
				similarity: cosineSimilarity(embedding, other.embedding)
			}))
			.sort((a, b) => b.similarity - a.similarity)
			.slice(0, n + 1);
		return similarities;
	}

	function getSimilarityColor(similarity: number): string {
		const g = 125 + Math.round(similarity * 100);
		return `rgb(255, ${g}, 71)`;
	}

	onMount(async () => {
		extractor = await pipeline('feature-extraction', 'mixedbread-ai/mxbai-embed-xsmall-v1');
	});

	let textBlocksWithSimilarity: (TextBlockWithEmbedding & { similarity: number })[] = $state([]);
</script>

<form onsubmit={handleSubmitSearch} class="search-form">
	<label for="search" class="search-label">Search for quotes:</label>
	<div class="search-input-group">
		<input
			type="text"
			id="search"
			bind:value={searchInput}
			placeholder="Enter your search..."
			class="search-input"
		/>
		<button class="search-button">Search</button>
	</div>
</form>

<div class="sticky-board">
	{#if textBlocksWithSimilarity.length === 0}
		<p>search a term to find relevant are.na text blocks</p>
	{/if}
	{#if extractor === null}
		<p>initializing embedding model...</p>
	{/if}
	{#each textBlocksWithSimilarity as textBlock}
		<div
			class="sticky-note"
			style="--rotation: {Math.random() * 6 - 3}deg; --color: {getSimilarityColor(
				textBlock.similarity
			)}"
		>
			<div style="height: 200px;">
				<p class="quote-text">"{textBlock.content}"</p>
			</div>
			<p class="quote-title">- {textBlock.title}</p>
			<p>similarity: {textBlock.similarity}</p>
			<a href="https://www.are.na/block/{textBlock.id}" target="_blank">source</a>
		</div>
	{/each}
</div>

<style>
	:root {
		--sticky-size: 350px;
	}
	.search-form {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		margin: 2rem auto;
		max-width: 600px;
	}

	.search-label {
		font-size: 1.2rem;
		margin-bottom: 0.5rem;
	}

	.search-input-group {
		display: flex;
		width: 100%;
		gap: 0.5rem;
	}

	.search-input {
		flex: 1;
		padding: 0.75rem 1rem;
		font-size: 1rem;
		border: 2px solid #ddd;
		border-radius: 4px;
		transition: border-color 0.2s ease;
	}

	.search-input:focus {
		outline: none;
		border-color: #666;
	}

	.search-button {
		padding: 0.75rem 1.5rem;
		font-size: 1rem;
		background: #333;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		transition: background 0.2s ease;
	}

	.search-button:hover {
		background: #555;
	}
	.sticky-board {
		display: grid;
		grid-template-columns: 1fr;
		gap: 2rem;
		padding: 2rem;
		justify-items: center;
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
		display: -webkit-box;
		line-clamp: 8;
		-webkit-line-clamp: 8; /* number of lines to show */
		-webkit-box-orient: vertical;
		overflow: hidden;
		text-overflow: ellipsis;
		color: rgb(0, 0, 0);
	}

	.quote-title {
		font-style: italic;
		text-align: right;
		color: #666;
	}
</style>
