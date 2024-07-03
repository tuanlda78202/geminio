import { Document } from "langchain/document";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TextLoader } from "langchain/document_loaders/fs/text";
import fs from 'fs/promises';
import path from 'path';

const TEXT_DIR = 'data';
const EMBEDDINGS_FILE = 'public/embeddings.json';

interface EmbeddedDocument {
    pageContent: string;
    metadata: Record<string, string>;
    embedding: number[];
}

let embeddedDocs: EmbeddedDocument[] | null = null;

async function saveEmbeddingsToFile(embeddings: EmbeddedDocument[]) {
    try {
        await fs.writeFile(EMBEDDINGS_FILE, JSON.stringify(embeddings), 'utf8');
        console.log("Embeddings successfully saved to file");
    } catch (error) {
        console.error("Error saving embeddings to file:", error);
    }
}

async function loadEmbeddingsFromFile(): Promise<EmbeddedDocument[] | null> {
    try {
        const response = await fetch(EMBEDDINGS_FILE);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Embeddings successfully loaded from file");
        return data;
    } catch (error) {
        console.error('Error loading embeddings:', error);
        return null;
    }
}

function parseDocument(content: string): Record<string, string> {
    const sections = content.split(/(?=# |## |### )/);
    const result: Record<string, string> = {};

    sections.forEach(section => {
        const lines = section.trim().split('\n');
        const header = lines[0].replace(/^#+\s*/, '').trim();
        const body = lines.slice(1).join('\n').trim();

        if (header.startsWith('TITLE:')) {
            result.title = header.replace('TITLE:', '').trim();
        } else if (header.startsWith('SUBTOPIC:')) {
            result.subtopic = header.replace('SUBTOPIC:', '').trim();
        } else if (header.startsWith('TAGS:')) {
            result.tags = header.replace('TAGS:', '').trim();
        } else {
            result[header.toLowerCase()] = body;
        }
    });

    return result;
}

export async function embedDocuments() {
    const embeddings = new GoogleGenerativeAIEmbeddings({
        modelName: "text-embedding-004",
        apiKey: process.env.VITE_GEMINI_KEY,
    });

    try {
        const files = await fs.readdir(TEXT_DIR);
        const embeddedDocs: EmbeddedDocument[] = [];

        for (const file of files) {
            const filePath = path.join(TEXT_DIR, file);
            const loader = new TextLoader(filePath);
            const [doc] = await loader.load();

            const parsedDoc = parseDocument(doc.pageContent);
            const { title, subtopic, tags, content, ...sections } = parsedDoc;

            for (const [sectionName, sectionContent] of Object.entries(sections)) {
                const embedding = await embeddings.embedQuery(sectionContent);
                embeddedDocs.push({
                    pageContent: sectionContent,
                    metadata: {
                        title,
                        subtopic,
                        tags,
                        section: sectionName,
                        file
                    },
                    embedding
                });
            }
            console.log(`Embedded document: ${file}`);
        }

        await saveEmbeddingsToFile(embeddedDocs);
        console.log("All documents embedded and stored in local file");
    } catch (error) {
        console.error("Error during document embedding:", error);
    }
}

function cosineSimilarity(vec1: number[], vec2: number[]): number {
    const dotProduct = vec1.reduce((sum, val, i) => sum + val * vec2[i], 0);
    const mag1 = Math.sqrt(vec1.reduce((sum, val) => sum + val * val, 0));
    const mag2 = Math.sqrt(vec2.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (mag1 * mag2);
}

export async function retrieveRelevantDocs(query: string): Promise<Document[]> {
    console.log(`Starting retrieval for query: "${query}"`);

    if (!embeddedDocs) {
        console.log("Loading embeddings from file...");
        embeddedDocs = await loadEmbeddingsFromFile();
        if (!embeddedDocs) {
            console.error("No embeddings found. Please run embedDocuments first.");
            return [];
        }
    }

    try {
        const embeddings = new GoogleGenerativeAIEmbeddings({
            modelName: "text-embedding-004",
            apiKey: import.meta.env.VITE_GEMINI_KEY,
        });

        console.log("Generating query embedding...");
        const queryEmbedding = await embeddings.embedQuery(query);

        console.log("Calculating similarities...");
        const scoredDocs = embeddedDocs.map((doc) => ({
            ...doc,
            score: cosineSimilarity(queryEmbedding, doc.embedding)
        }));

        scoredDocs.sort((a, b) => b.score - a.score);

        console.log("Top 5 similarity scores:");
        scoredDocs.slice(0, 5).forEach((doc, index) => {
            console.log(`${index + 1}. Score: ${doc.score.toFixed(4)}, Title: ${doc.metadata.title}, Section: ${doc.metadata.section}`);
        });

        const relevantDocs = scoredDocs.slice(0, 5).map(doc => new Document({
            pageContent: doc.pageContent,
            metadata: doc.metadata
        }));

        console.log(`Retrieved ${relevantDocs.length} relevant documents`);
        return relevantDocs;
    } catch (error) {
        console.error("Error during document retrieval:", error);
        return [];
    }
}

// Optional: Add a function to preprocess the query
function preprocessQuery(query: string): string {
    return query.toLowerCase().replace(/[^\w\s]/gi, '');
}

// Optional: Add a cache for frequently accessed embeddings
const embeddingCache = new Map<string, number[]>();

async function getCachedEmbedding(text: string, embeddings: GoogleGenerativeAIEmbeddings): Promise<number[]> {
    if (embeddingCache.has(text)) {
        return embeddingCache.get(text)!;
    }
    const embedding = await embeddings.embedQuery(text);
    embeddingCache.set(text, embedding);
    return embedding;
}