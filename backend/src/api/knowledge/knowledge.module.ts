import { Module } from "@nestjs/common";
import { KnowledgeService } from "./knowledge.service";
import { OllamaService } from "../../lib/agent/ollama.service";
import { KnowledgeController } from "./knowledge.controller";
import { AccessTokenStrategy } from "@/lib/guards/access.strategy";


@Module({
    providers: [KnowledgeService, OllamaService, AccessTokenStrategy],
    controllers: [KnowledgeController]
})
export class KnowledgeModule {}