

export interface Message {
    id: number,
    sender: "bot" | "client";
    text: string;
    time: Date;
}