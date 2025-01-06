export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Vectors must have same length');
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// modified from https://gist.github.com/sebleier/554280
// const originalStopWords = [
//   "i", "me", "my", "myself", "we", "our", "ours", "ourselves", "you", "your",
//   "yours", "yourself", "yourselves", "he", "him", "his", "himself", "she",
//   "her", "hers", "herself", "it", "its", "itself", "they", "them", "their",
//   "theirs", "themselves", "what", "which", "who", "whom", "this", "that",
//   "these", "those", "am", "is", "are", "was", "were", "be", "been", "being",
//   "have", "has", "had", "having", "do", "does", "did", "doing", "a", "an",
//   "the", "and", "but", "if", "or", "because", "as", "until", "while", "of",
//   "at", "by", "for", "with", "about", "against", "between", "into", "through",
//   "during", "before", "after", "above", "below", "to", "from", "up", "down",
//   "in", "out", "on", "off", "over", "under", "again", "further", "then",
//   "once", "here", "there", "when", "where", "why", "how", "all", "any", "both",
//   "each", "few", "more", "most", "other", "some", "such", "no", "nor", "not",
//   "only", "own", "same", "so", "than", "too", "very", "s", "t", "can", "will",
//   "just", "don", "should", "now"
// ];
export const stopWords = [
  "he", "him", "his", "himself", "she",
  "her", "hers", "herself", "it", "its", "itself", "they", "them", "their",
  "theirs", "themselves", "what", "which", "who", "whom", "this", "that",
  "these", "those", "am", "is", "are", "was", "were", "be", "been", "being",
  "have", "has", "had", "having", "do", "does", "did", "doing", "a", "an",
  "the", "and", "but", "if", "or", "because", "as", "until", "while", "of",
  "at", "by", "for", "with", "about", "against", "between", "into", "through",
  "during", "before", "after", "above", "below", "to", "from", "up", "down",
  "in", "out", "on", "off", "over", "under", "again", "further", "then",
  "once", "here", "there", "when", "where", "why", "how", "all", "any", "both",
  "each", "few", "more", "most", "some", "such", "no", "nor", "not",
  "only", "own", "same", "so", "than", "too", "very", "s", "t", "can",
  "just", "don", "should", "now"
];
