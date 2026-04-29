

export interface CreateMessage {
    whatsappId?: string;
    fromMe: boolean;
    remoteJid: string;
    pushName?: string;
    content: string;
    type: string;
    status: string;
}