import { Document } from "langchain/document";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TextLoader } from "langchain/document_loaders/fs/text";
import fs from 'fs/promises';
import path from 'path';

const TEXT_DIR = 'data';

async function initializeChromaDB(): Promise<Chroma> {
    const embeddings = new GoogleGenerativeAIEmbeddings({
        modelName: "embedding-001",
        apiKey: import.meta.env.VITE_GEMINI_KEY,
    });

    return await Chroma.fromExistingCollection(
        embeddings,
        { collectionName: "gdg_hanoi_docs" }
    );
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
        modelName: "embedding-001",
        apiKey: process.env.VITE_GEMINI_KEY,
    });

    const vectorStore = await Chroma.fromExistingCollection(
        embeddings,
        { collectionName: "gdg_hanoi_docs" }
    );

    const files = await fs.readdir(TEXT_DIR);

    for (const file of files) {
        const filePath = path.join(TEXT_DIR, file);
        const loader = new TextLoader(filePath);
        const [doc] = await loader.load();

        const parsedDoc = parseDocument(doc.pageContent);
        const { title, subtopic, tags, content, ...sections } = parsedDoc;

        // Embed each section separately
        for (const [sectionName, sectionContent] of Object.entries(sections)) {
            await vectorStore.addDocuments([
                new Document({
                    pageContent: sectionContent,
                    metadata: {
                        title,
                        subtopic,
                        tags,
                        section: sectionName,
                        file
                    }
                })
            ]);
        }
    }

    console.log("Documents embedded and stored in Chroma DB");
}

export async function retrieveRelevantDocs(query: string): Promise<Document[]> {
    const vectorStore = await initializeChromaDB();

    // Perform a similarity search
    const results = await vectorStore.similaritySearch(query, 5);

    return results;
}