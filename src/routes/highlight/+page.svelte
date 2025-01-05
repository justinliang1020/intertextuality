<script lang="ts">
	import HText from './HighlightableText.svelte';
	import type { ComponentProps } from 'svelte';
	import textBlocksJson from '$lib/text_blocks_with_embeddings.json';
	import { cosineSimilarity } from '$lib/utils';
	import type { TextBlockWithEmbedding } from '$lib/types';
	import type { FeatureExtractionPipeline } from '@huggingface/transformers';
	import { pipeline } from '@huggingface/transformers';
	import { onMount } from 'svelte';
	// highlight some text and it links to the next related text (need to ignore previously visited texts)

	let textBlocks: TextBlockWithEmbedding[] = textBlocksJson;
	let extractor: FeatureExtractionPipeline | null = $state(null);
	let hTexts: ComponentProps<HText>[] = $state([
		{
			text: 'We are dealing in a magic realm, nobody knows why or how it works',
			highlightedText: ''
		}
	]);
	onMount(async () => {
		extractor = await pipeline('feature-extraction', 'mixedbread-ai/mxbai-embed-xsmall-v1');
	});
	$effect(() => {
		const lastHText: ComponentProps<HText> = hTexts[hTexts.length - 1];
		if (!extractor) {
			return;
		}
		if (lastHText.highlightedText !== '') {
			getSimilarTextBlocks(lastHText.highlightedText, textBlocks, 2, extractor).then(
				(similarTextBlocks) => {
					const newHText: ComponentProps<HText> = {
						text: similarTextBlocks[1].content,
						highlightedText: ''
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
	): Promise<TextBlockWithEmbedding[]> {
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
	<HText text={h.text} bind:highlightedText={h.highlightedText} />
	<hr />
{/each}
