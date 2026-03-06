import { Pinecone, type RecordValues } from "@pinecone-database/pinecone";
import { logError } from "../logging/loggers.js";
import { withErrorHandling } from "../../utils/errorHandler.js";

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

const index = pinecone.index(process.env.PINECONE_INDEX_NAME!);
export type InsertEmbeddingParams = {
  id: string;
  embedding: Number[];
  metadata: any;
  namespace: string;
};
export const insertEmbedding = async ({
  id,
  embedding,
  metadata = {},
  namespace,
}: InsertEmbeddingParams) => {
  if (!id) throw new Error("id is required");
  if (!Array.isArray(embedding)) throw new Error("embedding must be an array");
  if (!namespace) throw new Error("namespace is required");

  await index.namespace(namespace).upsert({
    records: [
      {
        id,
        values: embedding as RecordValues,
        metadata,
      },
    ],
  });
};


export type QueryEmbeddingParams = {
  embedding: number[];
  namespace: string;
  topK?: number;
  filter?: Record<string, any>;
};

export const queryEmbeddings = async ({
  embedding,
  namespace,
  topK = 3,
  filter = {},
}: QueryEmbeddingParams) => {
  return withErrorHandling(
    "queryEmbeddings",
    "queryEmbeddings",
    "critical",
    async () => {
      if (!Array.isArray(embedding))
        throw new Error("embedding must be an array");
      if (!namespace) throw new Error("namespace is required");

      const results = await index.namespace(namespace).query({
        vector: embedding as RecordValues,
        topK,
        includeMetadata: true,
        filter,
      });

      return results.matches;
    },
  );
};
