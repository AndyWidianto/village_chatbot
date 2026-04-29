import { Module } from "@nestjs/common";
import { KnowledgeService } from "./knowledge.service";
import { AccessTokenStrategy } from "@/lib/guards/access.strategy";
import { OllamaService } from "@/lib/ollama/ollama.service";
import { KnowledgeController } from "./knowledge.controller";


@Module({
    providers: [KnowledgeService, AccessTokenStrategy, OllamaService],
    controllers: [KnowledgeController]
})
export class KnowledgeModule {}