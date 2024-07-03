import { embedDocuments } from '../src/hooks/useRAG.js';
import * as dotenv from 'dotenv';

dotenv.config();

async function main() {
    console.log("Starting document embedding process...");
    await embedDocuments();
    console.log("Document embedding process completed.");
}

main().catch((error) => {
    console.error("An error occurred during the embedding process:", error);
    process.exit(1);
});