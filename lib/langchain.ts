import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { writeFileSync, unlinkSync } from "fs";
import { join } from "path";

export async function fetchAndExtractPdfText(fileUrl: string) {
  try {
    // Step 1: Download PDF
    const response = await fetch(fileUrl);
    const arrayBuffer = await response.arrayBuffer();

    // Step 2: Save temporarily (required by PDFLoader)
    const tempDir = join(process.cwd(), "temp");
    const tempFilePath = join(tempDir, "temp.pdf");
    writeFileSync(tempFilePath, Buffer.from(arrayBuffer));

    // Step 3: Load PDF
    const loader = new PDFLoader(tempFilePath);
    const docs = await loader.load();

    // Step 4: Clean up temp file
    unlinkSync(tempFilePath);

    // Step 5: Combine all pages
    return docs.map((doc) => doc.pageContent).join("\n");
  } catch (error) {
    console.error("Error in fetchAndExtractPdfText:", error);
    throw new Error("Failed to extract text from PDF");
  }
}