

export type ChatPlatform = "WHATSAPP" | "TELEGRAM" | "WEB_CHAT";
export interface Citizen {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    nik: string | null;
    fullName: string | null;
    platformId: string;
    platform: ChatPlatform;
    subDistrict: string | null;
}

export interface CreateCitizen {
    phoneNumber: string;
    nik: string;
    fullName: string;
    platform: ChatPlatform;
    platformId: string;
    subDistrict: string;
}