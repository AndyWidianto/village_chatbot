import { io, Socket } from "socket.io-client";

interface ServerToClientEvents {
    message: (data: any) => void;
    notification: (msg: string) => void;
    receiver_message: (data: { number: string, message: string, name: string }) => void;
}

interface ClientToServerEvents {
    send_message: (data: any) => void;
}

const urlWebsocket = import.meta.env.VITE_URL_WEBSOCKET!;
export default function useSocket({ accessToken }: { accessToken: string | null }) {
    const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(urlWebsocket|| "ws://localhost:3000", {
        auth: {
            token: `Bearer ${accessToken}`
        },
        transports: ["websocket"],
        autoConnect: true
    });
    return {
        socket
    }
}

