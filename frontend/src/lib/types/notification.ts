
export interface Notification {
    content: string;
    createdAt: string;
    id: string;
    isRead: boolean;
    title: string;
    type: string;
    updatedAt: string;
    userId: string;
    user: {
        id: string;
        name: string;
        email: string;
        profileUrl: string;
    }
}