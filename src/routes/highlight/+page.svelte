<script lang="ts">
	import HighlightableText from './HighlightableText.svelte';
	import type { ComponentProps } from 'svelte';
	// highlight some text and it links to the next related text (need to ignore previously visited texts)
	let highlightableTexts: ComponentProps<HighlightableText>[] = $state([
		{
			text: 'We are dealing in a magic realm, nobody knows why or how it works',
			highlightedText: ''
		},
		{
			text: 'skibid toilet',
			highlightedText: ''
		}
	]);
	$effect(() => {
		$inspect(highlightableTexts);
	});
</script>

{#each highlightableTexts as h}
	<HighlightableText text={h.text} bind:highlightedText={h.highlightedText} />
{/each}
