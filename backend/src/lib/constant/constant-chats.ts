import { Message } from "ollama";


export interface HistoryChat {
    id: string;
    pushName: string | null;
    number: string;
    subDistrict: string | null;
    chat: Message[];
    createdAt: Date;
    updatedAt: Date;
}
export const CACHE_RAM_HISTORY_CHAT: Record<string, HistoryChat> = {};
