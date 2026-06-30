import { Module } from "@nestjs/common";
import { KnowledgeService } from "./knowledge.service";
import { OllamaService } from "../../lib/agent/ollama.service";
import { KnowledgeController } from "./knowledge.controller";
import { AccessTokenStrategy } from "@/lib/guards/access.strategy";
import { GeminiService } from "@/lib/agent/gemini.service";


@Module({
    providers: [KnowledgeService, OllamaService, AccessTokenStrategy, GeminiService],
    controllers: [KnowledgeController]
})
export class KnowledgeModule {}