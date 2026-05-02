import { Injectable, OnModuleInit } from "@nestjs/common";
import { Ollama } from "ollama";
import { Content, GoogleGenerativeAI } from "@google/generative-ai";



interface HistoryChatbot {
    id: string;
    chat: Content[];
}

@Injectable()
export class OllamaService implements OnModuleInit {
    private genAI: GoogleGenerativeAI;
    private historyChatbot: HistoryChatbot[] = [];
    private ollama = new Ollama({ host: process.env.BASE_URL_OLLAMA || "http://127.0.0.1:11434" });

    constructor() { }

    onModuleInit() {
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    }

    async embeddings(text: string) {
        const response = await this.ollama.embeddings({
            model: 'bge-m3',
            prompt: text,
        });

        const embedding = response.embedding;
        return embedding;
    }

    async embeddingsGemini(text: string) {
        const model = this.genAI.getGenerativeModel({ model: "gemini-embedding-2" });
        const result = await model.embedContent({
            content: {
                parts: [{ text: text }]
            },
            outputDimensionality: 1024,
        } as any);

        const embedding = result.embedding;
        return embedding.values;
    }

    async chatbot(id: string, prompt: string, systemRules: string) {
        // const response = await ollama.chat({
        //     model: 'gemma3:1b',
        //     messages: [{ role: 'user', content: prompt }],
        //     stream: false
        // });
        // return response.message.content;
        const history = this.historyChatbot.find(h => h.id === id);
        const model = this.genAI.getGenerativeModel({
            model: "gemma-3n-e2b-it",
        });
        try {
            const chat = model.startChat({
                history: [
                    {
                        role: "user",
                        parts: [{ text: systemRules }],
                    },
                    {
                        role: "model",
                        parts: [{ text: "Baik, saya mengerti." }],
                    },
                    ...(history?.chat || [])
                ]
            })
            const result = await chat.sendMessage(prompt);
            const response = await result.response;
            const text = response.text();
            if (!history) {
                this.historyChatbot.push({
                    id: id, chat: [
                        { role: "user", parts: [{ text: prompt }] },
                        { role: "model", parts: [{ text: text }] }
                    ]
                });
            } else {
                history.chat.push({ role: "user", parts: [{ text: prompt }] });
                history.chat.push({ role: "model", parts: [{ text: text }] });

                const MAX_HISTORY = 10;
                if (history.chat.length > MAX_HISTORY) {
                    history.chat.splice(0, history.chat.length - MAX_HISTORY);
                }
            }
            return text;
        } catch (err) {
            console.error("Waduh, ada error:", err);
        }
    }

    async reWrite(id: string, message: string): Promise<string> {
        const model = this.genAI.getGenerativeModel({ model: "gemma-3n-e2b-it" });
        const history = this.historyChatbot.find(h => h.id === id);

        try {
            const chat = model.startChat({
                history: [
                    {
                        role: "user",
                        parts: [{
                            text: `Tugas kamu adalah mengekstrak inti sari dan kata kunci dari pesan warga desa untuk pencarian dokumen (RAG). 
                        Hilangkan kata-kata basa-basi, singkatan tidak baku, dan emosi. 
                        Ubah menjadi kalimat tanya atau pernyataan yang padat informasi dan mengandung kata kunci administratif yang relevan.`
                        }],
                    },
                    {
                        role: "model",
                        parts: [{
                            text: "Saya mengerti. Saya akan mengekstrak kata kunci dan informasi administratif penting dari pesan warga untuk pencarian dokumen."
                        }],
                    },
                    ...(history?.chat || [])
                ],
            });
            const result = await chat.sendMessage(`Ekstrak kata kunci pencarian dari pesan ini: "${message}"`);
            const response = await result.response;
            const optimizedQuery = response.text().trim();

            console.log(`Original: ${message} | Optimized for Embedding: ${optimizedQuery}`);

            return optimizedQuery || message;

        } catch (error) {
            console.error("Gagal melakukan ReWrite untuk Embedding:", error);
            return message;
        }
    }
}