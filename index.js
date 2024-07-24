import MistralClient from "@mistralai/mistralai";
import { createClient } from "@supabase/supabase-js";

/*
const client = new MistralClient("4OnzNmyIMUi8LHtrwtomYr1sNmJEcsd5");
const supabase = createClient(
  "https://tvciiuagdenuwqpzdrdo.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2Y2lpdWFnZGVudXdxcHpkcmRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjE2ODYwNzYsImV4cCI6MjAzNzI2MjA3Nn0.VsS-ocWtphjrdS-4BKh-Z5O3hJsrMiOuF4t5gelA74k",
);

// get the user input
const input = "Which rootstock is best for grafting the Satsuma citrus variety and get the best TSS?"

// create the embedding of the input
const embedding = await createEmbedding (input);

// retrive similar embeddings text chunks 
const context = await retrieveMatches (embedding);

const response = await generateChatResponse (context, input);

console.log( response )

async function createEmbedding(input) {
  const embeddingResponse = await client.embeddings({
    model: "mistral-embed",
    input: [input],
  });
  return embeddingResponse.data[0].embedding;
}

async function retrieveMatches(embedding){
  const { data } = await supabase.rpc('match_handbook_docs', {
    query_embedding: embedding, // Pass the embedding you want to compare
    match_threshold: 0.78, // Choose an appropriate threshold for your data
    match_count: 5, // Choose the number of matches
  });
  return data.map(chunk => chunk.content).reverse().join(" ")
}

async function generateChatResponse (context, query) {
  const response = await client.chat({
    model: 'mistral-large-latest',
    messages: [{
      role: 'user',
      content: `Handbook context: ${context} - Question:"+ ${query}`
    }]
  })
  return response.choices[0].message.content;
}
*/

import { readPdfText } from "pdf-text-reader";
import { promises as fs } from "fs";
import { PdfReader } from "pdfreader";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { fileURLToPath } from "url";
import path from "path";

const client = new MistralClient("4OnzNmyIMUi8LHtrwtomYr1sNmJEcsd5");

// Call your async function
let citrusFindings = await splitDocument("handbook.txt");

//const data = await createEmbeddings(citrusFindings);
//await supabase.from("handbook_docs").insert(data);

async function splitDocument(fileName) {
  try {
    
    const text = await fs.readFile(filePath, "utf-8"); // Read the file content
    // Process the fileContent as needed
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1300,
      chunkOverlap: 40,
    });
    const output = await splitter.createDocuments([text]);
    const textArr = output.map((chunk) => chunk.pageContent);
    return textArr;
  } catch (error) {
    console.error("Error reading the file:", error);
  }
}

async function createEmbeddings(input) {
  const embeddings = await client.embeddings({
    model: "mistral-embed",
    input: input,
  });
  const data = chunks.map((chunk, i) => {
    return {
      content: chunk,
      embedding: embeddings.data[i].embedding,
    };
  });
  return data;
}