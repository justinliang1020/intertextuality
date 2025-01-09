import * as fs from 'fs';
import type { TextBlock } from '../src/lib/types.ts'

// Change this to whatever list of channels you want to scrape test blocks from
const channelUrls = [
  "https://www.are.na/justin-liang/quotes-nlcurs8qjuk",
  "https://www.are.na/sav/unearthing-qc-5dw1r9k",
  "https://www.are.na/michelle-sueann/brain-imprints",
  "https://www.are.na/lydia-beyer-0bf1yyz78li/text-t_yc04u6kt4",
  "https://www.are.na/erin-bugee/quotation-mark-underscore-quotation-mark",
]

function parseArenaChannelSlug(url: string): string {
  //parses are.na channel slug from an are.na URL.
  //i.e. `https://www.are.na/justin-liang/fake-wikipedia-memes` => `fake-wikipedia-memes`
  //i.e. `https://www.are.na/justin-liang/uncategorized-x90eek6ekqu` => `uncategorized-x90eek6ekqu`
  const regex = /https:\/\/www\.are\.na\/[^/]+\/([^/]+)/;
  const match = url.match(regex);
  if (match && match[1]) {
    return match[1];
  }

  throw new Error("Invalid Are.na URL. Couldn't parse channel.");
}

async function scrape_text_blocks(channelUrl: string, ids: Set<number>): Promise<TextBlock[]> {
  const channelSlug = parseArenaChannelSlug(channelUrl)
  const baseUrl = `https://api.are.na/v2/channels/${channelSlug}`;
  const textBlocks: TextBlock[] = [];

  let currentPage = 1;
  let hasMoreData = true;

  while (hasMoreData) {
    console.log(`Fetching page ${currentPage} for ${channelSlug}`); // Debug log for pagination

    const response = await fetch(`${baseUrl}?page=${currentPage}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch channel data: ${response.statusText}`);
    }

    const data = await response.json();
    // Process blocks from contents
    if (data.contents && data.contents.length > 0) {
      for (const block of data.contents) {
        if (block.class === "Text" && block.content && !ids.has(block.id as number)) {
          ids.add(block.id as number)
          textBlocks.push({
            id: block.id as number,
            title: block.title || "Untitled",
            content: block.content,
            channelSlug: channelSlug,
          });
        }
      }
    } else {
      hasMoreData = false; // Stop looping if no more contents
    }

    currentPage++; // Move to the next page
  }
  return textBlocks
}


//TODO: get rid of duplicates?
const textBlocks: TextBlock[] = [];
const ids: Set<number> = new Set<number>();
for (const channelUrl of channelUrls) {
  const blocks = await scrape_text_blocks(channelUrl, ids);
  textBlocks.push(...blocks);
}

const file_name = `text_blocks_${textBlocks.length}.json`;
// Save text blocks to JSON file
fs.writeFile(
  file_name,
  JSON.stringify(textBlocks, null, 2),
  function (err) {
    if (err) {
      return console.error(err);
    }
    console.log(`Saved ${textBlocks.length} text blocks to ${file_name}`);
  });
