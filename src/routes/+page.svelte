<script lang="ts">
	interface Quote {
		id: number;
		text: string;
		author: string;
	}

	let quotes: Quote[] = $state([
		{
			id: 1,
			text: 'Be the change you wish to see in the world',
			author: 'Mahatma Gandhi'
		},
		{
			id: 2,
			text: 'The only way to do great work is to love what you do',
			author: 'Steve Jobs'
		},
		{
			id: 3,
			text: "Life is what happens when you're busy making other plans",
			author: 'John Lennon'
		},
		{
			id: 4,
			text: "In three words I can sum up everything I've learned about life: it goes on",
			author: 'Robert Frost'
		},
		{
			id: 5,
			text: 'To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment',
			author: 'Ralph Waldo Emerson'
		},
		{
			id: 6,
			text: 'Two roads diverged in a wood, and I took the one less traveled by',
			author: 'Robert Frost'
		},
		{
			id: 7,
			text: 'The future belongs to those who believe in the beauty of their dreams',
			author: 'Eleanor Roosevelt'
		},
		{
			id: 8,
			text: 'Success is not final, failure is not fatal: it is the courage to continue that counts',
			author: 'Winston Churchill'
		},
		{
			id: 9,
			text: 'The only impossible journey is the one you never begin',
			author: 'Tony Robbins'
		},
		{
			id: 10,
			text: "Everything you've ever wanted is on the other side of fear",
			author: 'George Addair'
		},
		{
			id: 11,
			text: 'What lies behind us and what lies before us are tiny matters compared to what lies within us',
			author: 'Ralph Waldo Emerson'
		},
		{
			id: 12,
			text: 'The best time to plant a tree was 20 years ago. The second best time is now',
			author: 'Chinese Proverb'
		},
		{
			id: 13,
			text: 'It does not matter how slowly you go as long as you do not stop',
			author: 'Confucius'
		},
		{
			id: 14,
			text: 'Everything has beauty, but not everyone sees it',
			author: 'Confucius'
		},
		{
			id: 15,
			text: 'The journey of a thousand miles begins with one step',
			author: 'Lao Tzu'
		},
		{
			id: 16,
			text: 'The only person you are destined to become is the person you decide to be',
			author: 'Ralph Waldo Emerson'
		},
		{
			id: 17,
			text: 'What we think, we become',
			author: 'Buddha'
		},
		{
			id: 18,
			text: 'Do what you can, with what you have, where you are',
			author: 'Theodore Roosevelt'
		},
		{
			id: 19,
			text: 'Be not afraid of greatness. Some are born great, some achieve greatness, and others have greatness thrust upon them',
			author: 'William Shakespeare'
		},
		{
			id: 20,
			text: 'The best revenge is massive success',
			author: 'Frank Sinatra'
		}
	]);

	let lastClickedIndex: number | null = null;

	function shuffleQuotes(excludeId: number) {
		const clickedIndex = quotes.findIndex((q) => q.id === excludeId);
		if (lastClickedIndex == clickedIndex) {
			return;
		}
		lastClickedIndex = clickedIndex;
		const otherQuotes = quotes.filter((q) => q.id !== excludeId);
		const clickedQuote = quotes[clickedIndex];

		// Fisher-Yates shuffle algorithm
		for (let i = otherQuotes.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[otherQuotes[i], otherQuotes[j]] = [otherQuotes[j], otherQuotes[i]];
		}

		// Insert the clicked quote back at its original position
		otherQuotes.splice(clickedIndex, 0, clickedQuote);
		quotes = otherQuotes;
	}
</script>

<div class="sticky-board">
	{#each quotes as quote (quote.id)}
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
			<p class="quote-text">"{quote.text}"</p>
			<p class="quote-author">- {quote.author}</p>
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

	.quote-author {
		font-style: italic;
		text-align: right;
		color: #666;
	}
</style>
