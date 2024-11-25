import { OpenAIEmbeddings } from "@langchain/openai";

export async function documentEmbeddings(text: string) {
  const embeddings = new OpenAIEmbeddings({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_KEY,
  });
  const vector = embeddings.embedQuery(text);

  return vector;
}
