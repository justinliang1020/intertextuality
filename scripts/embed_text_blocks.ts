// takes in a text_blocks.json file produced by scrape_text_blocks.ts
// and adds a text embedding field to it
//
// example:
// [
//   {
//     "id": 32687157,
//     "title": "Muriel Rukeyser",
//     "content": "The universe is made of stories, not of atoms.",
//     "channelSlug": "quotes-nlcurs8qjuk"
//   },
//   ...
// ]
// 
// result:
//
// [
//   {
//     "id": 32687157,
//     "title": "Muriel Rukeyser",
//     "content": "The universe is made of stories, not of atoms.",
//     "channelSlug": "quotes-nlcurs8qjuk"
//     "embedding": [0.437219749821, 0.68919019, 0.29381498, ...]
//   },
//   ...
// ]

import * as fs from 'fs';
import { pipeline } from '@huggingface/transformers';
import type { TextBlock } from './scrape_text_blocks';

interface TextBlockWithEmbedding extends TextBlock {
  embedding: number[]
}
const textBlocksJson = fs.readFileSync('text_blocks.json', 'utf8');
const textBlocks: TextBlock[] = JSON.parse(textBlocksJson);
console.log(`Loaded text_blocks.json, found ${textBlocks.length} text blocks to embed`);
const extractor = await pipeline(
  "feature-extraction",
  "mixedbread-ai/mxbai-embed-xsmall-v1",
);
const texts = textBlocks.map((textBlock) => textBlock.content);
console.log('Embedding...')
const time = Date.now();
const embeddings = await extractor(texts, { pooling: "mean", normalize: true });
// Add embeddings to each text block
const textBlocksWithEmbeddings: TextBlockWithEmbedding[] = textBlocks.map((textBlock, index) => ({
  ...textBlock,
  embedding: embeddings[index].tolist()
}));

const fileName = 'text_blocks_with_embeddings.json';
fs.writeFile(
  fileName,
  JSON.stringify(textBlocksWithEmbeddings, null, 2),
  function (err) {
    if (err) {
      return console.error(err);
    }
    console.log("File created!");
  });

console.log(`Finished in ${(Date.now() - time) / 1000}`)
console.log(`Saved ${textBlocksWithEmbeddings.length} text blocks to ${fileName}`);
