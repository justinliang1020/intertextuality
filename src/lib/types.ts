//TODO: consolidate these better
export interface TextBlock {
  id: number; // scraped from block
  title: string; // scraped from block
  content: string; // scraped from block
  channelSlug: string; // scarped from channel name
};
export interface TextBlockWithEmbedding extends TextBlock {
  embedding: number[];
}
