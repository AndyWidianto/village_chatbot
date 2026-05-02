import { GoogleGenerativeAI } from "@google/generative-ai";


const genAI = new GoogleGenerativeAI();
async function embeddingsGemini() {
    const model = genAI.getGenerativeModel({ model: "gemini-embedding-2" });
    const result = await model.embedContent({
        content: {
            // 'role' biasanya tidak diperlukan untuk embedding, cukup 'parts'
            parts: [{ text: "Teks ini akan diubah jadi vektor 1024 dimensi" }]
        },
        outputDimensionality: 1024,
    });

    const embedding = result.embedding;
    console.log(embedding);
    return embedding;
}

embeddingsGemini()