import { Pinecone } from "@pinecone-database/pinecone";
import { downloadFileFromS3 } from "./s3";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { documentEmbeddings } from "./embedding";

type pdfDocs = {
  pageContent: string;
  metadata: {
    loc: {
      pageNumber: number;
    };
  };
};
export const getPineconeClient = async () => {
  const pc = new Pinecone({
    apiKey: process.env.NEXT_PUBLIC_PINECONE_DB_API_KEY!,
  });

  return pc;
};

export async function embededToPinconeDb(fileKey: string) {
  console.log("Downloading PDF file from s3");
  const filePath = await downloadFileFromS3(fileKey);
  if (!filePath) throw new Error("Couldn't download from s3");

  const loader = new PDFLoader(filePath);
  const docs = (await loader.load()) as pdfDocs[];

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const splitDocs = await textSplitter.splitDocuments(docs);
  const embeddings = await Promise.all(
    splitDocs.map((doc) => documentEmbeddings(doc.pageContent))
  );

  const pineconeClient = await getPineconeClient();
  const pineconeIndex = pineconeClient.index(
    process.env.NEXT_PUBLIC_PINECONE_INDEX!
  );
  return splitDocs;
}

async function embededDocument(doc: Document) {
  try {
  } catch (error) {
    console.error(`Embedding document error ${error}`);
    throw error;
  }
}
