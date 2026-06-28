import { Module } from "@nestjs/common";
import { ChatbotService } from "./chatbot.service";
import { OllamaService } from "../../lib/agent/ollama.service";
import { ChatbotController } from "./chatbot.controller";
import { AccessTokenStrategy } from "../../lib/guards/access.strategy";
import { GeminiService } from "@/lib/agent/gemini.service";



@Module({
    providers: [ChatbotService, OllamaService, AccessTokenStrategy, GeminiService],
    controllers: [ChatbotController],
    exports: [ChatbotService]
})
export class ChatbotModule {}