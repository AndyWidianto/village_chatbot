import { EvolutionService } from "@/lib/evolutions/evolutions.service";
import { PrismaService } from "@/lib/prisma/prisma.service";
import { EvolutionWebhookPayload } from "@/lib/types";
import { Injectable } from "@nestjs/common";
import { ChatbotService } from "../chatbot/chatbot.service";
import { MessageService } from "../message/message.service";
import { StatusMessage } from "@/lib/shared/message";



@Injectable()
export class WebhookService {
    constructor(
        private prisma: PrismaService,
        private evolution: EvolutionService,
        private chatbotService: ChatbotService,
        private messageService: MessageService
    ) { }

    async webhook(id: string, body: EvolutionWebhookPayload) {
        console.log(body);
        try {
            if (body.event === "messages.upsert") {
                const isMe = body.data.key.fromMe;
                if (isMe) return { success: true, message: "Ignored self message" };

                const message = body.data.message.conversation || body.data.message.extendedTextMessage?.text || "";
                const remoteJid = body.data.key.remoteJid;
                const instanceName = body.instance;


                if (!message) return { success: true };
                this.messageService.create({
                    whatsappId: instanceName,
                    remoteJid: remoteJid,
                    fromMe: true,
                    type: "text",
                    content: message,
                    pushName: body.data.pushName,
                    status: StatusMessage.sent
                })

                await this.autoreply(instanceName, remoteJid, message);
            }

            return { success: true, message: "Successfully" }
        } catch (err) {
            console.log(err);
            return { success: false }
        }
    }

    async autoreply(instaceName: string, remoteJid: string, message: string) {
        const number = remoteJid.split("@")[0];
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
            await this.evolution.sendTextMessage(instaceName, number, existing.replyContent || "");
            return { success: true };
        }

        const chatbot = await this.chatbotService.chatbot({ id: remoteJid, message: message });
        if (chatbot?.answer) {
            console.log(chatbot.answer);
            const parseAIChat = this.convertMarkdownToWhatsApp(chatbot.answer);
            await this.evolution.sendTextMessage(instaceName, number, parseAIChat);
        }

        return { success: true };
    }
    convertMarkdownToWhatsApp(text: string) {
        if (!text) return "";

        let formattedText = text;
        formattedText = formattedText.replace(/`{1,3}([\s\S]*?)`{1,3}/g, '```$1```');
        formattedText = formattedText.replace(/\*\*\*(.*?)\*\*\*/g, '*_$1_*');
        formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, '*$1*');
        formattedText = formattedText.replace(/~~(.*?)\s*~~/g, '~$1~');
        formattedText = formattedText.replace(/(^|[^\*\s])\*([^\*\s][^\*]*[^\*\s])\*([^\*\s]|$)/g, '$1_$2_$3');
        formattedText = formattedText.replace(/^>\s+/gm, '> ');
        formattedText = formattedText.replace(/^[ \t]*[*+-][ \t]+/gm, '• ');
        formattedText = formattedText.replace(/^[ \t]*(\d+)\.[ \t]+/gm, '$1. ');

        return formattedText.trim();
    }

    // --- CONTOH PENGGUNAAN ---
    //     const markdownInput = `
    // **Ini Bold**
    // *Ini Italic*
    // ~~Ini Strikethrough~~
    // ***Ini Bold Italic***
    // **~~Bold Strike~~**
    // > Ini adalah quote
    // - List item 1
    // - List item 2
    // 1. Siji
    // 2. Loro
    // `;
}