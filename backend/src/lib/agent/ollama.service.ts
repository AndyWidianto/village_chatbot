import { Injectable, InternalServerErrorException, OnModuleInit } from "@nestjs/common";
import { Message, Ollama } from "ollama";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ConfigService } from "@nestjs/config";
import { CACHE_RAM_HISTORY_CHAT } from "../constant/constant-chats";



@Injectable()
export class OllamaService implements OnModuleInit {
    private genAI: GoogleGenerativeAI;
    private ollama = new Ollama({ host: process.env.BASE_URL_OLLAMA || "http://127.0.0.1:11434" });
    private models: string[] = [];
    private model: string;
    private modelsEmbedding: string[] = [];

    constructor(private configService: ConfigService) { }

    onModuleInit() {
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
        this.fetchModels();
    }

    fetchModels() {
        this.model = this.configService.get<string>("MODEL_AI")!;
        this.models = [
            process.env.MODEL_PRIMARY || "gemini-2.5-flash-lite",
            process.env.MODEL_SECONDARY || "gemma-4-26b-a4b-it",
            process.env.MODEL_TERTIARY || "gemma-4-31b-it"
        ];
        this.modelsEmbedding = [
            process.env.MODEL_EMBEDDING_PRIMARY || "bge-m3",
            process.env.MODEL_EMBEDDING_SECONDARY || "gemini-embedding-001",
        ];
    }

    async embeddings(text: string) {
        const response = await this.ollama.embeddings({
            model: this.configService.get<string>("MODEL_EMBEDDING")!,
            prompt: text,
        });

        const embedding = response.embedding;
        return embedding;
    }

    async embeddingsGemini(text: string) {
        for (const modelName of this.modelsEmbedding) {
            try {
                const model = this.genAI.getGenerativeModel({ model: modelName });
                const result = await model.embedContent({
                    content: {
                        parts: [{ text: text }]
                    },
                    outputDimensionality: 1024,
                } as any);

                const embedding = result.embedding;
                return embedding.values;
            } catch (err) {
                console.error(`Gagal mendapatkan embedding dari model ${modelName}:`, err);
            }
        }
        throw new Error("Gagal mendapatkan embedding dari semua model yang tersedia.");
    }

    async chatbot(id: string, prompt: string, systemRules: string) {
        try {
            const history = CACHE_RAM_HISTORY_CHAT[id];
            const response = await this.ollama.chat({
                model: this.model,
                messages: [
                    {
                        role: "user",
                        content: systemRules
                    },
                    {
                        role: "model",
                        content: "Baik, saya mengerti."
                    },
                    ...(history?.chat || []),
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                stream: false
            });
            const text = response.message.content;
            return text;
        } catch (err) {
            console.error(`Gagal mendapatkan jawaban:`, err);
            throw new InternalServerErrorException("Gagal mendapat jawaban");
        }
    }

    async reWrite(id: string, message: string): Promise<string> {
        const history = CACHE_RAM_HISTORY_CHAT[id];
        try {
            const result = await this.ollama.chat({
                model: this.model,
                messages: [
                    {
                        role: "user",
                        content: `Tugas kamu adalah mengekstrak inti sari dan kata kunci dari pesan warga desa untuk pencarian dokumen (RAG). 
                        Hilangkan kata-kata basa-basi, singkatan tidak baku, dan emosi. 
                        Ubah menjadi kalimat tanya atau pernyataan yang padat informasi dan mengandung kata kunci administratif yang relevan.`
                    },
                    {
                        role: "system",
                        content: "Saya mengerti. Saya akan mengekstrak kata kunci dan informasi administratif penting dari pesan warga untuk pencarian dokumen."
                    },
                    ...(history?.chat || []),
                    {
                        role: "user",
                        content: `Ekstrak kata kunci pencarian dari pesan ini: "${message}"`
                    }
                ],
                stream: false
            });
            const response = result.message.content;
            return response || message;
        } catch (err) {
            console.error(`Gagal melakukan reWrite:`, err);
            throw new InternalServerErrorException("Gagal melakukan rewrite");
        }
    }
}