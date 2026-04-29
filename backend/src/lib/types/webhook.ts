// 1. Definisikan masing-masing tipe data event
export interface MessageUpsertData {
  key: {
    remoteJid: string;
    fromMe: boolean;
    id: string;
  };
  pushName: string;
  message: {
    conversation?: string;
    extendedTextMessage?: { text: string };
    imageMessage?: any;
  };
  messageType: string;
}

export interface MessageUpdateData {
  key: {
    remoteJid: string;
    fromMe: boolean;
    id: string;
  };
  update: {
    status: number;
  };
}

export interface ConnectionUpdateData {
  state: "open" | "connecting" | "close";
  statusReason?: number;
}

// 2. Gabungkan menggunakan OR (|)
export type EvolutionWebhookPayload =
  | { event: "messages.upsert"; data: MessageUpsertData; instance: string; apikey: string }
  | { event: "messages.update"; data: MessageUpdateData; instance: string; apikey: string }
  | { event: "connection.update"; data: ConnectionUpdateData; instance: string; apikey: string };