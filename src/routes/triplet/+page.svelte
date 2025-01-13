<script lang="ts">
	import TextBlock from '$lib/TextBlock.svelte';
	import textBlocksJson from '$lib/data/text_blocks_with_embeddings_415.json';
	import type { TextBlockWithEmbedding } from '$lib/types';
	import { findSimilarTextBlocks } from '$lib/utils';

	//TODO: deduplication
	//TODO: better accessibility support for focus and select

	interface Quote extends TextBlockWithEmbedding {
		selected: boolean;
	}

	const NUM_QUOTES = 3;
	const MAX_QUOTE_LENGTH = 300;

	const allQuotes: Quote[] = textBlocksJson
		.filter((t) => t.content.length < MAX_QUOTE_LENGTH)
		.map((t) => ({
			...t,
			selected: false
		}));
	let quoteRows: Quote[][] = $state([
		getSimilarQuotes(allQuotes[Math.floor(Math.random() * allQuotes.length)], NUM_QUOTES)
	]);

	function getSimilarQuotes(quote: Quote, n: number): Quote[] {
		const similarTextBlocks = findSimilarTextBlocks(
			quote as TextBlockWithEmbedding,
			allQuotes as TextBlockWithEmbedding[],
			n
		);
		const similarQuotes = similarTextBlocks.map((t) => ({
			...t,
			selected: false
		}));

		return similarQuotes;
	}

	function onQuoteClick(quote: Quote, r: number, c: number) {
		const similarQuotes = getSimilarQuotes(quote, NUM_QUOTES);
		quoteRows[r][c].selected = true;
		quoteRows.push(similarQuotes);
	}
</script>

<main>
	<!-- <div class="sidebar"> -->
	<!-- 	<h1>the creative act</h1> -->
	<!-- 	<TextBlock text={selectedQuote.text} title={selectedQuote.chapterTitle} /> -->
	<!-- </div> -->
	<h1>triplet</h1>
	<p>hover over a text block reveal it's contents.</p>
	<p>click on it to get semantically relevant text blocks.</p>
	<div>
		{#each quoteRows as quoteRow, r}
			<div class="content">
				{#if r === quoteRows.length - 1}
					{#each quoteRow as quote, c}
						<button
							class="text-block"
							onclick={(event) => {
								onQuoteClick(quote, r, c);
								event.currentTarget.blur();
							}}
						>
							<TextBlock text={quote.content} title={quote.title} hiddenUntilHover={true} />
						</button>
					{/each}
				{:else}
					{#each quoteRow as quote}
						{#if quote.selected}
							<div class="text-block selected">
								<TextBlock
									text={quote.content}
									title={quote.title}
									source={`https://www.are.na/block/${quote.id}`}
								/>
							</div>
						{:else}
							<div class="text-block">
								<TextBlock text={''} title={quote.title} />
							</div>
						{/if}
					{/each}
					<!-- else content here -->
				{/if}
			</div>
			<hr />
		{/each}
	</div>
</main>

<style>
	.text-block {
		all: unset;
		border: 1px solid transparent;
	}

	button.text-block {
		cursor: pointer;
	}

	button.text-block:hover {
		border: 1px solid white;
	}

	button.text-block:focus {
		border: 1px solid white;
	}

	.selected {
		border: 1px solid green;
	}

	.content {
		margin-top: 1rem;
		min-inline-size: 50%;
		display: flex;
		align-items: center;
		justify-content: space-evenly;
	}
</style>
