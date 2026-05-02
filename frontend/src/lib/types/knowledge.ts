
export interface Knowledge {
    id: string;
    name: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}


export interface CreateKnowledge {
    name: string;
    content?: string;
    file?: File | null;
}