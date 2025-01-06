<script lang="ts">
	import HighlightableText from './HighlightableText.svelte';
	import textBlocksJson from '$lib/text_blocks_with_embeddings.json';
	import { cosineSimilarity } from '$lib/utils';
	import type { TextBlockWithEmbedding } from '$lib/types';
	import type { FeatureExtractionPipeline } from '@huggingface/transformers';
	import { pipeline } from '@huggingface/transformers';
	import { onMount } from 'svelte';
	// highlight some text and it links to the next related text (need to ignore previously visited texts)

	interface HText {
		text: string;
		highlightedText: string;
		source: string;
		similarity: number | null;
		title: string;
	}
	let textBlocks: TextBlockWithEmbedding[] = textBlocksJson;
	let extractor: FeatureExtractionPipeline | null = $state(null);
	const randomIndex = Math.floor(textBlocks.length * Math.random());
	const initialHText: HText = {
		text: textBlocks[randomIndex].content,
		highlightedText: '',
		source: `https://www.are.na/block/${textBlocks[randomIndex].id}`,
		similarity: null,
		title: textBlocks[randomIndex].title
	};
	let hTexts: HText[] = $state([initialHText]);
	onMount(async () => {
		extractor = await pipeline('feature-extraction', 'mixedbread-ai/mxbai-embed-xsmall-v1');
	});
	$effect(() => {
		const lastHText: HText = hTexts[hTexts.length - 1];
		if (!extractor) {
			return;
		}
		if (lastHText.highlightedText !== '') {
			getSimilarTextBlocks(lastHText.highlightedText, textBlocks, 2, extractor).then(
				(similarTextBlocks) => {
					const newHText: HText = {
						text: similarTextBlocks[1].content,
						highlightedText: '',
						source: `https://www.are.na/block/${similarTextBlocks[1].id}`,
						similarity: similarTextBlocks[1].similarity,
						title: similarTextBlocks[1].title
					};
					hTexts.push(newHText);
				}
			);
		}
	});

	async function getSimilarTextBlocks(
		input: string,
		textBlocks: TextBlockWithEmbedding[],
		count: number,
		extractor: FeatureExtractionPipeline
	): Promise<(TextBlockWithEmbedding & { similarity: number })[]> {
		//NOTE: if the input is in the text blocks, it will likely return the same text block
		const embedding = (await extractor(input, { pooling: 'mean', normalize: true })).tolist()[0];
		const similarities = textBlocks
			.map((other) => ({
				...other,
				similarity: cosineSimilarity(embedding, other.embedding)
			}))
			.sort((a, b) => b.similarity - a.similarity)
			.slice(0, count + 1);
		return similarities;
	}
</script>

{#each hTexts as h}
	<HighlightableText text={h.text} bind:highlightedText={h.highlightedText} />
	<div class="metadata">
		<p><i>{h.title}</i></p>
		<a href={h.source}>source</a>
		{#if h.similarity}
			<p>similarity: {Math.trunc(h.similarity * 100)}%</p>
		{/if}
	</div>
	<hr />
{/each}

<style>
	.metadata {
		text-align: center;
	}
</style>
