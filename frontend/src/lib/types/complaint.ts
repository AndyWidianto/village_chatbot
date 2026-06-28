import type { ChatPlatform } from "./citizen";

export type ComplaintCategory = "INFRASTRUCTURE" | "ADMINISTRATION" | "SECURITY" | "SOCIAL_ASSISTANCE" | "HEALTH" | "OTHERS";
export type ComplaintStatus = "PENDING" | "IN_PROGRESS" | "RESOLVED" | "REJECTED";
export interface Complaint {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    ticketNumber: string;
    title: string;
    description: string;
    category: ComplaintCategory;
    status: ComplaintStatus;
    attachmentUrl: string | null;
    officerNotes: string | null;
    citizenId: string;
}

export interface CreateComplaint {
  title: string;
  description: string;
  category: ComplaintCategory;
  status: ComplaintStatus;
  officerNotes: string;
  citizenId: string;
  file: File | null;
}

export interface SearchComplaint {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    ticketNumber: string;
    title: string;
    description: string;
    category: ComplaintCategory;
    status: ComplaintStatus;
    attachmentUrl: string | null;
    officerNotes: string | null;
    citizenId: string;
    citizen: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        nik: string | null;
        fullName: string | null;
        platformId: string;
        platform: ChatPlatform;
        subDistrict: string | null;
    };
}