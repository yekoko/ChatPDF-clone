import { documentEmbeddings } from "./embedding";
import { getPineconeClient } from "./pinecone";

const getMatches = async (nameSpace: string, embedding: number[]) => {
  const pineconeClient = await getPineconeClient();
  const pineconeIndex = pineconeClient.index(
    process.env.NEXT_PUBLIC_PINECONE_INDEX!
  );

  try {
    const result = await pineconeIndex.namespace(nameSpace).query({
      vector: embedding,
      topK: 3,
      includeMetadata: true,
    });
    return result.matches || [];
  } catch (error) {
    console.error(`Getting context error ${error}`);
  }
};
export const getFileContext = async (query: string, nameSpace: string) => {
  const embeddings = await documentEmbeddings(query);
  const matches = await getMatches(nameSpace, embeddings);
  
  const resultDocs = matches?.filter(
    (match) => match.score && match.score > 0.7
  );

  type Metadata = {
    text: string;
    pageNumber: number;
  };

  const docs = resultDocs?.map((doc) => (doc.metadata as Metadata).text);

  return docs?.join("\n").substring(0, 3000);
};
