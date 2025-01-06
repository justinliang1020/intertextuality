<script lang="ts">
	import { tapOutside } from '$lib/clickOutside';
	import { stopWords } from '$lib/utils';
	let {
		text,
		relatedQuote,
		highlightedText = $bindable()
	}: { text: string; relatedQuote: string; highlightedText: string } = $props();

	// click a word. that word gets selected as word1
	// highlight over other words, those words get possibly selected
	// clicking on a second word means that all words in between word1 and word2 are selected
	// this will automatically query for the next text
	// after clicking the first word, click outside any words to reset the selection of word1
	// let text = 'We are dealing in a magic realm, nobody knows why or how it works';
	let words = text.split(' ');
	let iWord1: number | null = $state(null);
	let iWord2: number | null = $state(null);
	let iWordFocused: number | null = $state(null);
	let relatedWords: string[] = (relatedQuote.match(/\b(\w+)\b/g) || []).filter(
		(word: string) => !stopWords.includes(word.toLowerCase())
	);
	$effect(() => {
		if (iWord1 !== null && iWord2 !== null) {
			highlightedText = words
				.slice(Math.min(iWord1, iWord2), Math.max(iWord1, iWord2) + 1)
				.join(' ');
		}
	});

	function onWordClick(i: number) {
		if (iWord1 === null) {
			iWord1 = i;
			return;
		}
		iWord2 = i;
	}
	function onWordFocus(i: number) {
		if (iWord1 == i) {
			return;
		}
		iWordFocused = i;
	}

	function onOutsideTap() {
		if (iWord2 === null) {
			iWord1 = null;
		}
	}

	function isInBetween(a: number, b: number, c: number): boolean {
		return (a < b && b < c) || (c < b && b < a);
	}

	function isInBetweenInclusive(a: number, b: number, c: number): boolean {
		return (a <= b && b <= c) || (c <= b && b <= a);
	}
</script>

<div class="text-container" use:tapOutside={() => onOutsideTap()}>
	<!-- CSS background-color precedence means that :hover/:focus background-color takes precedence over CSS class background-color-->
	{#each words as word, i}
		{#if iWord1 !== null && iWord2 !== null}
			{#if isInBetweenInclusive(iWord1, i, iWord2)}
				<span style="background-color: green;">{word}&nbsp</span>
			{:else}
				<span>{word}&nbsp</span>
			{/if}
		{:else if iWord1 == i}
			<!-- content here -->
			<button
				class="word-button word-1"
				onclick={() => onWordClick(i)}
				onmouseover={() => onWordFocus(i)}
				onfocus={() => onWordFocus(i)}>{word}&nbsp</button
			>
		{:else if iWord1 !== null && iWordFocused != null && isInBetween(iWord1, i, iWordFocused)}
			<button
				class="word-button word-in-between"
				onclick={() => onWordClick(i)}
				onmouseover={() => onWordFocus(i)}
				onfocus={() => onWordFocus(i)}>{word}&nbsp</button
			>
		{:else if relatedWords.includes(word.toLowerCase())}
			<button
				class="word-button word-related"
				onclick={() => onWordClick(i)}
				onmouseover={() => onWordFocus(i)}
				onfocus={() => onWordFocus(i)}>{word}&nbsp</button
			>
		{:else}
			<!-- else content here -->
			<button
				class="word-button"
				onclick={() => onWordClick(i)}
				onmouseover={() => onWordFocus(i)}
				onfocus={() => onWordFocus(i)}>{word}&nbsp</button
			>
		{/if}
	{/each}
</div>

<style>
	.text-container {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem;
		font-size: 2em;
	}

	.word-button {
		all: unset;
		cursor: pointer;
		display: inline;
		font-size: inherit;
		font-family: inherit;
		padding: 0;
		margin: 0;
		border: none;
		background: none;
	}

	.word-1 {
		background-color: greenyellow;
	}

	.word-in-between {
		background-color: blue;
	}

	.word-related {
		background-color: purple;
	}

	.word-button:hover {
		background-color: orange;
	}

	.word-button:focus {
		background-color: orange;
	}
</style>
