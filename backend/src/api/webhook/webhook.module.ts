import { Module } from "@nestjs/common";
import { WebhookService } from "./webhook.service";
import { WebhookController } from "./webhook.controller";
import { EvolutionModule } from "../../lib/evolutions/evolutions.module";
import { ChatbotModule } from "../chatbot/chatbot.module";
import { MessageModule } from "../message/message.module";
import { CitizenModule } from "../citizen/citizen.module";
import { ComplaintModule } from "../complaint/complaint.module";


@Module({
    providers: [WebhookService],
    controllers: [WebhookController],
    imports: [EvolutionModule, ChatbotModule, MessageModule, CitizenModule, ComplaintModule]
})
export class WebhookModule {}

