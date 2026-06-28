import { Injectable, InternalServerErrorException, OnModuleInit } from "@nestjs/common";
import { Message, Ollama } from "ollama";
import { Content, GoogleGenerativeAI } from "@google/generative-ai";
import { ConfigService } from "@nestjs/config";
import { CACHE_RAM_HISTORY_CHAT } from "../constant/constant-chats";
import { CACHE_RAM_MODEl_GEMINI } from "../constant/constant-model";


interface GoogleAPIError {
    code?: number;
    status?: string;
    message?: string;
}

@Injectable()
export class GeminiService implements OnModuleInit {
    private genAI: GoogleGenerativeAI;
    private models: string[] = [];
    private modelRewrite: string[] = [];
    private modelsEmbedding: string[] = [];

    constructor(private configService: ConfigService) { }

    onModuleInit() {
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
        this.fetchModels();
    }

    fetchModels() {
        const modelsRewrite = [
            process.env.MODEL_REWRITE_PRIMARY || "gemini-3.1-flash-lite",
            process.env.MODEL_REWRITE_SECONDARY || "gemini-2.5-flash-lite",
            process.env.MODEL_REWRITE_TERTIARY || "gemini-3-flash-preview",
            process.env.MODEL_REWRITE_OTHER || "gemini-2.5-flash",
        ];
        const models = [
            process.env.MODEL_PRIMARY || "gemma-4-31b-it",
            process.env.MODEL_SECONDARY || "gemma-4-26b-a4b-it",
            process.env.MODEL_TERTIARY || "gemini-2.5-flash-lite",
        ];
        const modelEmbeddings = [
            process.env.MODEL_EMBEDDING_PRIMARY || "gemini-embedding-2",
            process.env.MODEL_EMBEDDING_SECONDARY || "gemini-embedding-001",
            process.env.MODEL_EMBEDDING_TERTIARY || "gemini-embedding-2-preview",
        ]
        this.models = [...models, ...modelsRewrite];
        this.modelRewrite = [...modelsRewrite, ...models];
        this.modelsEmbedding = modelEmbeddings;
        for (const model of [...models, ...modelsRewrite, ...modelEmbeddings]) {
            CACHE_RAM_MODEl_GEMINI[model] = {
                id: model,
                isActive: true,
                totalError: 0,
                whenUpdate: new Date(),
            }
        }
        for (const model of modelsRewrite) {
            CACHE_RAM_MODEl_GEMINI[model] = {
                id: model,
                isActive: true,
                totalError: 0,
                whenUpdate: new Date(),
            }
        }
    }
    isGoogleError(err: any): err is GoogleAPIError {
        return err && typeof err === 'object' && ('code' in err || 'status' in err);
    }


    async embeddingsGemini(text: string) {
        for (const modelName of this.modelsEmbedding) {
            let modelGemini = CACHE_RAM_MODEl_GEMINI[modelName];
            if (!modelGemini.isActive) {
                const now = new Date();
                const whenUpdate = new Date(modelGemini.whenUpdate);
                if (now.getTime() < whenUpdate.getTime()) continue;
                modelGemini.isActive = true;
                modelGemini.totalError = 0;
            }
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
            } catch (err: unknown) {
                console.error(`Gagal mendapatkan jawaban dari model ${modelName}:`, err);
                const now = new Date();

                let cooldownDuration = 3 * 60 * 1000;

                if (this.isGoogleError(err)) {
                    const errorString = JSON.stringify(err);

                    if (err.code === 429 || err.status === 'RESOURCE_EXHAUSTED' || errorString.includes('429')) {

                        if (errorString.includes('RequestsPerDay')) {
                            console.warn(`🚨 Model ${modelName} mencapai batas kuota harian (RPD - Requests Per Day).`);
                            const tomorrowReset = new Date();
                            tomorrowReset.setDate(tomorrowReset.getDate() + 1);
                            tomorrowReset.setHours(14, 0, 0, 0); // Jam 14:00 WIB

                            cooldownDuration = tomorrowReset.getTime() - now.getTime();

                        } else if (errorString.includes('RequestsPerMinute')) {
                            console.warn(`⏳ Model ${modelName} mencapai batas kuota per menit (RPM - Requests Per Minute).`);

                            cooldownDuration = 2 * 60 * 1000;

                        } else {
                            console.warn(`⚠️ Model ${modelName} mencapai batas kuota umum (Rate Limit).`);
                            cooldownDuration = 3 * 60 * 1000; // Fallback 3 menit
                        }
                    }
                }

                modelGemini.isActive = false;
                modelGemini.totalError = (modelGemini.totalError || 0) + 1;
                modelGemini.whenUpdate = new Date(now.getTime() + cooldownDuration);

                console.log(`[Quota Management] Model ${modelName} dinonaktifkan hingga: ${modelGemini.whenUpdate.toLocaleString('id-ID')}`);
            }
        }
        throw new Error("Gagal mendapatkan embedding dari semua model yang tersedia.");
    }

    async chatbot(id: string, prompt: string, systemRules: string) {
        const history = CACHE_RAM_HISTORY_CHAT[id];
        for (const m of this.models) {
            let modelGemini = CACHE_RAM_MODEl_GEMINI[m];
            if (!modelGemini.isActive) {
                const now = new Date();
                const whenUpdate = new Date(modelGemini.whenUpdate);
                if (now.getTime() < whenUpdate.getTime()) continue;
                modelGemini.isActive = true;
                modelGemini.totalError = 0;
            }
            try {
                const model = this.genAI.getGenerativeModel({
                    model: m,
                    systemInstruction: systemRules,
                });
                let histoyGemini: Content[] = [];
                if (history) {
                    histoyGemini = history.chat.map<Content>(h => ({ role: h.role === "system" ? "model" : "user", parts: [{ text: h.content }] }))
                }
                const stratChat = model.startChat({
                    history: [
                        // { role: "user", parts: [{ text: systemRules }] },
                        // { role: "model", parts: [{ text: "Baik, saya mengerti." }] },
                        ...(histoyGemini || [])
                    ]
                });
                const result = await stratChat.sendMessage(prompt);
                const text = result.response.text();
                const cleanedText = (text.split('===JAWABAN===').pop() || text).trim();
                return cleanedText;
            } catch (err: unknown) {
                console.error(`Gagal mendapatkan jawaban dari model ${m}:`, err);
                const now = new Date();

                let cooldownDuration = 3 * 60 * 1000;

                if (this.isGoogleError(err)) {
                    const errorString = JSON.stringify(err);

                    if (err.code === 429 || err.status === 'RESOURCE_EXHAUSTED' || errorString.includes('429')) {

                        if (errorString.includes('RequestsPerDay')) {
                            console.warn(`🚨 Model ${m} mencapai batas kuota harian (RPD - Requests Per Day).`);
                            const tomorrowReset = new Date();
                            tomorrowReset.setDate(tomorrowReset.getDate() + 1);
                            tomorrowReset.setHours(14, 0, 0, 0); // Jam 14:00 WIB

                            cooldownDuration = tomorrowReset.getTime() - now.getTime();

                        } else if (errorString.includes('RequestsPerMinute')) {
                            console.warn(`⏳ Model ${m} mencapai batas kuota per menit (RPM - Requests Per Minute).`);

                            cooldownDuration = 2 * 60 * 1000;

                        } else {
                            console.warn(`⚠️ Model ${m} mencapai batas kuota umum (Rate Limit).`);
                            cooldownDuration = 3 * 60 * 1000; // Fallback 3 menit
                        }
                    }
                }

                modelGemini.isActive = false;
                modelGemini.totalError = (modelGemini.totalError || 0) + 1;
                modelGemini.whenUpdate = new Date(now.getTime() + cooldownDuration);

                console.log(`[Quota Management] Model ${m} dinonaktifkan hingga: ${modelGemini.whenUpdate.toLocaleString('id-ID')}`);
            } finally {
                CACHE_RAM_MODEl_GEMINI[m] = modelGemini;
            }
        }
    }

    async reWrite(id: string, message: string): Promise<string> {
        const history = CACHE_RAM_HISTORY_CHAT[id];
        for (const m of this.modelRewrite) {
            let modelGemini = CACHE_RAM_MODEl_GEMINI[m];
            if (!modelGemini.isActive) {
                const now = new Date();
                const whenUpdate = new Date(modelGemini.whenUpdate);
                if (now.getTime() < whenUpdate.getTime()) continue;
                modelGemini.isActive = true;
            }
            try {
                const model = this.genAI.getGenerativeModel({
                    model: m,
                    systemInstruction: `Tugas kamu adalah mengekstrak inti sari dan kata kunci dari pesan warga desa untuk pencarian dokumen (RAG). 
                        Hilangkan kata-kata basa-basi, singkatan tidak baku, dan emosi. 
                        Ubah menjadi kalimat tanya atau pernyataan yang padat informasi dan mengandung kata kunci administratif yang relevan.
                        format output: 
                            Sebelum jawaban yang akan dibaca warga, WAJIB tulis:
                            ===JAWABAN===
                            Setelah itu baru berikan jawaban.
                            Apabila perlu mengirim JSON, letakkan JSON di bagian PALING AKHIR.`
                });
                let histoyGemini: Content[] = [];
                if (history) {
                    histoyGemini = history.chat.map<Content>(h => ({ role: h.role === "system" ? "model" : h.role, parts: [{ text: h.content }] }));
                }
                const stratChat = model.startChat({
                    history: [
                        // {
                        //     role: "user", parts: [{
                        //         text: `Tugas kamu adalah mengekstrak inti sari dan kata kunci dari pesan warga desa untuk pencarian dokumen (RAG). 
                        // Hilangkan kata-kata basa-basi, singkatan tidak baku, dan emosi. 
                        // Ubah menjadi kalimat tanya atau pernyataan yang padat informasi dan mengandung kata kunci administratif yang relevan.` }]
                        // },
                        // { role: "model", parts: [{ text: "Saya mengerti. Saya akan mengekstrak kata kunci dan informasi administratif penting dari pesan warga untuk pencarian dokumen." }] },
                        ...(histoyGemini || [])
                    ]
                });
                const result = await stratChat.sendMessage(`Ekstrak kata kunci pencarian dari pesan ini: "${message}"`);
                const text = result.response.text();
                const cleanedText = (text.split('===JAWABAN===').pop() || text).trim();
                return cleanedText;
            } catch (err: unknown) {
                console.error(`Gagal mendapatkan jawaban dari model ${m}:`, err);
                const now = new Date();

                let cooldownDuration = 3 * 60 * 1000;

                if (this.isGoogleError(err)) {
                    const errorString = JSON.stringify(err);

                    if (err.code === 429 || err.status === 'RESOURCE_EXHAUSTED' || errorString.includes('429')) {

                        if (errorString.includes('RequestsPerDay')) {
                            console.warn(`🚨 Model ${m} mencapai batas kuota harian (RPD - Requests Per Day).`);
                            const tomorrowReset = new Date();
                            tomorrowReset.setDate(tomorrowReset.getDate() + 1);
                            tomorrowReset.setHours(14, 0, 0, 0); // Jam 14:00 WIB

                            cooldownDuration = tomorrowReset.getTime() - now.getTime();

                        } else if (errorString.includes('RequestsPerMinute')) {
                            console.warn(`⏳ Model ${m} mencapai batas kuota per menit (RPM - Requests Per Minute).`);

                            cooldownDuration = 2 * 60 * 1000;

                        } else {
                            console.warn(`⚠️ Model ${m} mencapai batas kuota umum (Rate Limit).`);
                            cooldownDuration = 3 * 60 * 1000; // Fallback 3 menit
                        }
                    }
                }

                modelGemini.isActive = false;
                modelGemini.totalError = (modelGemini.totalError || 0) + 1;
                modelGemini.whenUpdate = new Date(now.getTime() + cooldownDuration);

                console.log(`[Quota Management] Model ${m} dinonaktifkan hingga: ${modelGemini.whenUpdate.toLocaleString('id-ID')}`);
            } finally {
                CACHE_RAM_MODEl_GEMINI[m] = modelGemini;
            }
        }
        return "Mohon maaf, sistem kami sedang mengalami gangguan. Silakan coba beberapa saat lagi.";
    }
}