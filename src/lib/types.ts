//TODO: consolidate these better
export interface TextBlockWithEmbedding {
  id: number; // scraped from block
  title: string; // scraped from block
  content: string; // scraped from block
  channelSlug: string; // scarped from channel name
  embedding: number[];
}
