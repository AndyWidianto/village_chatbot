import { EvolutionService } from "../../lib/evolutions/evolutions.service";
import { PrismaService } from "../../lib/prisma/prisma.service";
import { EvolutionWebhookPayload, ResultComplaint } from "../../lib/types";
import { Inject, Injectable } from "@nestjs/common";
import { ChatbotService } from "../chatbot/chatbot.service";
import { MessageService } from "../message/message.service";
import { StatusMessage } from "../../lib/shared/message";
import { CitizenService } from "../citizen/citizen.service";
import { ComplaintService } from "../complaint/complaint.service";
import { CACHE_RAM_HISTORY_CHAT } from "@/lib/constant/constant-chats";
import { ConfigService } from "@nestjs/config";
import { Autoreply, StatusDevice } from "@prisma/client";
import type { Cache } from "cache-manager";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { CACHE_RAM_AUTOREPLY } from "@/lib/constant/constant-cache";



@Injectable()
export class WebhookService {
    private baseUrlFrontend = "";
    private statusInstance: Record<string, { status: StatusDevice }> = {};
    constructor(
        private prisma: PrismaService,
        private evolution: EvolutionService,
        private chatbotService: ChatbotService,
        private messageService: MessageService,
        private citizenService: CitizenService,
        private complaintService: ComplaintService,
        private configService: ConfigService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) {
        this.baseUrlFrontend = configService.get<string>("BASE_URL_FRONTEND")!;
    }

    async webhook(id: string, body: EvolutionWebhookPayload) {
        try {
            if (body.event === "messages.upsert") {
                const isMe = body.data.key.fromMe;
                if (isMe) return { success: true, message: "Ignored self message" };
                const message = body.data.message.conversation ||
                    body.data.message.imageMessage?.caption ||
                    body.data.message.documentMessage?.caption ||
                    body.data.message.extendedTextMessage?.text
                "";
                const base64 = body.data.base64
                const remoteJid = body.data.key.remoteJid;
                const instanceName = body.instance;
                const pushName = body.data.pushName;
                if (!message) return { success: true };
                await this.messageUpsert(instanceName, remoteJid, message, pushName, base64);
            }
            if (body.event === "connection.update") {
                const dataMessage = body.data;
                const instance = body.instance;
                const parseStatus: StatusDevice = dataMessage.state === "open" ? "CONNECTED" : dataMessage.state === "connecting" ? "CONNECTING" : "DISCONNECTED";
                let instanceStatus = this.statusInstance[instance];
                if (!instanceStatus) {
                    const findDevice = await this.prisma.device.findFirst({
                        where: { instanceName: instance }
                    });
                    if (!findDevice) {
                        const newDevice = await this.prisma.device.create({
                            data: {
                                instanceName: instance,
                                name: instance,
                                status: parseStatus
                            }
                        });
                        this.statusInstance[instance] = { status: newDevice.status };
                        return { success: true, message: "Berhasil update status" };
                    }
                    instanceStatus = { status: findDevice.status };
                }
                const parseStatusToEvo = instanceStatus.status === "CONNECTED" ? "open" : instanceStatus.status === "CONNECTING" ? "connecting" : "close";
                if (parseStatusToEvo !== dataMessage.state) {
                    const updateDevice = await this.prisma.device.update({
                        where: { instanceName: instance },
                        data: { status: parseStatus }
                    });
                    console.log(updateDevice);
                }
            }

            return { success: true, message: "Successfully" };
        } catch (err) {
            console.log(err);
            return { success: false }
        }
    }

    async messageUpsert(instaceName: string, remoteJid: string, message: string, pushName: string, base64?: string) {
        console.time("aiResponse");
        let autoreply: Autoreply | undefined = CACHE_RAM_AUTOREPLY[message];
        if (!autoreply) {
            const existing = await this.prisma.autoreply.findFirst({
                where: {
                    name: {
                        contains: message,
                        mode: "insensitive"
                    },
                    type: "keyword",
                    isActive: true
                }
            });
            if (existing) {
                CACHE_RAM_AUTOREPLY[message] = existing;
                autoreply = existing;
            }
        }
        const number = remoteJid.split("@")[0];
        let historyChat = CACHE_RAM_HISTORY_CHAT[number];
        if (!historyChat) {
            const citizen = await this.prisma.citizen.findFirst({
                where: { id: number }
            });
            if (!citizen) {
                const citizen = await this.citizenService.create({
                    fullName: pushName,
                    phoneNumber: number,
                    platform: "WHATSAPP",
                    platformId: remoteJid,
                    subDistrict: "",
                    nik: ""
                });
                const newHistory = {
                    id: citizen.id,
                    pushName: null,
                    number: number,
                    subDistrict: null,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    chat: []
                }
                historyChat = newHistory;
            } else {
                historyChat = {
                    id: citizen.id,
                    number: citizen.id,
                    chat: [],
                    pushName: citizen.fullName,
                    subDistrict: citizen.subDistrict,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }
            }
            CACHE_RAM_HISTORY_CHAT[number] = historyChat;
        }
        if (autoreply) {
            await this.evolution.sendTextMessage(instaceName, number, autoreply.replyContent || "");
            historyChat.chat.push(...[
                { role: "user", content: message },
                { role: "system", content: autoreply.replyContent || "" }
            ]);
        } else {
            const chatbot = await this.chatbotService.chatbot({ id: number, message: message });
            if (chatbot?.answer) {
                let aiResponse = chatbot.answer;
                const complaintRegex = /<DataComplaint>([\s\S]*?)<\/DataComplaint>/;
                const userRegex = /<DataUser>([\s\S]*?)<\/DataUser>/;
                const match = aiResponse.match(complaintRegex);
                const matchUser = aiResponse.match(userRegex);

                if (matchUser) {
                    aiResponse = aiResponse.replace(userRegex, '').trim();
                    try {
                        const jsonSting = matchUser[1].trim();
                        const userData: { name: string, subDistrict: string } = JSON.parse(jsonSting);
                        console.log('🎉 Data User Ditemukan!', userData);

                        await this.prisma.citizen.update({
                            where: { id: number },
                            data: {
                                fullName: userData.name,
                                subDistrict: userData.subDistrict
                            }
                        })
                        historyChat.pushName = userData.name;
                        historyChat.subDistrict = userData.subDistrict;
                        CACHE_RAM_HISTORY_CHAT[number] = historyChat;
                    } catch (err: any) {
                        console.error('Tag ditemukan, tetapi struktur JSON di dalamnya tidak valid:', err.message);
                        aiResponse = aiResponse.replace(userRegex, '').trim();
                    }
                }
                if (match) {
                    try {
                        const jsonString = match[1].trim();
                        const complaintData: ResultComplaint = JSON.parse(jsonString);
                        if (complaintData.action === 'CREATE_COMPLAINT') {
                            const newComplaint = await this.complaintService.create({
                                category: complaintData.data.category,
                                citizenId: number,
                                description: complaintData.data.description,
                                title: complaintData.data.title,
                                status: "PENDING",
                                officerNotes: "",
                            })
                            aiResponse = `✅ Pengaduan Anda berhasil kami terima. \n📌 Nomor Tiket: *${newComplaint.ticketNumber}* \nMohon simpan nomor tiket tersebut karena akan digunakan untuk mengecek perkembangan pengaduan Anda. Anda dapat memantau status pengaduan melalui tautan berikut:\n ${this.baseUrlFrontend}/complaint/search \nTerima kasih sudah melaporkan. Kami akan segera meneruskan pengaduan Anda kepada petugas terkait. 🙏`;
                        }
                    } catch (error: any) {
                        console.error('Tag ditemukan, tetapi struktur JSON di dalamnya tidak valid:', error.message);
                        aiResponse = aiResponse.replace(complaintRegex, '').trim();
                    }
                }
                const parseAIChat = this.convertMarkdownToWhatsApp(aiResponse);
                await this.evolution.sendTextMessage(instaceName, number, parseAIChat);
                historyChat.chat.push(...[
                    { role: "user", content: message },
                    { role: "system", content: aiResponse }
                ]);
            }
        }
        console.timeEnd("aiResponse");
        await this.messageService.create({
            whatsappId: instaceName,
            remoteJid: remoteJid,
            fromMe: true,
            type: "text",
            content: message,
            pushName: pushName,
            status: StatusMessage.sent
        }).catch(() => null);

        const MAX_HISTORY = 15;
        if (historyChat.chat.length > MAX_HISTORY) {
            historyChat.chat.splice(0, historyChat.chat.length - MAX_HISTORY);
        }
        CACHE_RAM_HISTORY_CHAT[number] = historyChat;
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
}