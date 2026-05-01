import { Module } from "@nestjs/common";
import { ChatbotService } from "./chatbot.service";
import { OllamaService } from "../../lib/ollama/ollama.service";
import { ChatbotController } from "./chatbot.controller";
import { AccessTokenStrategy } from "../../lib/guards/access.strategy";



@Module({
    providers: [ChatbotService, OllamaService, AccessTokenStrategy],
    controllers: [ChatbotController],
    exports: [ChatbotService]
})
export class ChatbotModule {}