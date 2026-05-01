import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../lib/prisma/prisma.service";
import { OllamaService } from "../../lib/ollama/ollama.service";



interface KnowledgeChunk {
    content: string;
    similarity: number;
}

@Injectable()
export class ChatbotService {
    constructor(
        private prisma: PrismaService,
        private ollama: OllamaService
    ) { }

    async chatbot(data: { id: string, message: string }) {
        const autoreply = await this.prisma.autoreply.findFirst({
            where: { type: "ai_rag", isActive: true }
        });

        if (!autoreply) return { answer: "Layanan sedang non-aktif.", sources: [] };

        let searchMessage = data.message;
        if (data.message.length < 10) {
            searchMessage = await this.ollama.reWrite(data.id, data.message);
        }

        const userVector = await this.ollama.embeddings(searchMessage);
        const vectorString = `[${userVector.join(',')}]`;

        const contextChunks = await this.prisma.$queryRaw<KnowledgeChunk[]>`
        SELECT content, 1 - (embedding <=> ${vectorString}::vector) AS similarity
        FROM knowledges
        WHERE 1 - (embedding <=> ${vectorString}::vector) > 0.5
        ORDER BY similarity DESC
        LIMIT 3
    `;

        if (!contextChunks || contextChunks.length === 0) {
            return {
                answer: "Mohon maaf, informasi tersebut belum tersedia di database pelayanan desa kami. Silakan hubungi kantor desa secara langsung.",
                sources: []
            };
        }

        const contextText = contextChunks.map(c => c.content).join('\n\n');
        const systemRules = `${autoreply.aiPrompt || 'Asisten Desa...'} \n\n KONTEKS: \n ${contextText}`;

        const response = await this.ollama.chatbot(data.id, data.message, systemRules);

        return {
            answer: response,
            confidence: contextChunks[0]?.similarity,
            sources: contextChunks.map(c => c.content.substring(0, 50) + "...")
        };
    }

    async autoreply(id: string, message: string) {
        const existing = await this.prisma.autoreply.findFirst({
            where: {
                name: {
                    contains: message,
                    mode: "insensitive"
                },
                type: "keyword"
            }
        });

        if (existing) {
            return {
                answer: existing.replyContent,
            }
        }
        return await this.chatbot({ id, message });
    }
}