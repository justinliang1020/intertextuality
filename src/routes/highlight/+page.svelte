<script lang="ts">
	import HText from './HighlightableText.svelte';
	import type { ComponentProps } from 'svelte';
	// highlight some text and it links to the next related text (need to ignore previously visited texts)
	let hTexts: ComponentProps<HText>[] = $state([
		{
			text: 'We are dealing in a magic realm, nobody knows why or how it works',
			highlightedText: ''
		}
	]);
	$effect(() => {
		const lastHText: ComponentProps<HText> = hTexts[hTexts.length - 1];
		if (lastHText.highlightedText !== '') {
			const newHText: ComponentProps<HText> = {
				text: 'Here, time transforms from rigid hour calendar bricks to a flowing fountain circulating without end. I recall so fondly our moments picking each other’s brain baskets, using friendship as a euphemism when we were really talking about love.',
				highlightedText: ''
			};
			//TODO: get similar text here
			hTexts.push(newHText);
		}
	});
</script>

{#each hTexts as h}
	<HText text={h.text} bind:highlightedText={h.highlightedText} />
	<hr />
{/each}
