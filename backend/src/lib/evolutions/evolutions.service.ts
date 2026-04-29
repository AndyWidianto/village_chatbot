import { HttpException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import axios from "axios";


@Injectable()
export class EvolutionService {
    private axiosEvolution = axios.create({
        baseURL: process.env.EVOLUTION_URL,
        timeout: 10000,
        headers: {
            "apikey": process.env.EVOLUTION_API_KEY,
        }
    });
    async getInstances(instanceName?: string) {
        try {
            const instances = await this.axiosEvolution.get(`/instance/fetchInstances${instanceName ? `?instanceName=${instanceName}`: ''}`);
            return instances.data;
        } catch (err: any) {
            console.log("Error: ", err.response);
            throw new InternalServerErrorException("Error fetching instances");
        }
    }
    async createInstance({ instanceName }) {
        if (!instanceName) {
            throw new NotFoundException("Missing required fields");
        }
        try {
            const instance = await this.axiosEvolution.post("/instance/create", {
                instanceName: instanceName,
                integration: "WHATSAPP-BAILEYS",
            });
            return instance.data;
        } catch (err: any) {
            console.log(err);
            console.error("Error: ", err.response.data.response.message);
            throw new HttpException(err.response.data.response.message, err.status);
        }
    }
    async setWebhook({ instance, url }) {
        if (!instance || !url) {
            throw new NotFoundException("Instance and URL are required");
        }
        try {
            const response = await this.axiosEvolution.post(`/webhook/set/${instance}`, {
                webhook: {
                    url: url,
                    enabled: true,
                    events: [
                        "MESSAGES_UPSERT",
                        "MESSAGES_UPDATE",
                        "CONNECTION_UPDATE"
                    ],
                    webhook_by_events: true,
                    webhook_base64: true
                }
            }
            );
            return response.data;
        } catch (err: any) {
            console.error("Error: ", err.response.data.response.message);
            throw new InternalServerErrorException("Error setting webhook");
        }
    }
    async instanceConnect(instanceName: string) {
        try {
            const instance = await this.axiosEvolution.get(`/instance/connect/${instanceName}`);
            return instance.data;
        } catch (err: any) {
            console.log("Error: ", err.response.data.response.message);
            throw new InternalServerErrorException("Error connecting to instance");
        }
    }
    async connectingState(instanceName: string) {
        try {
            const instance = await this.axiosEvolution.get(`/instance/connectionState/${instanceName}`);
            return instance.data;
        } catch (err: any) {
            console.log("Error: ", err.response.data.response.message);
            throw new InternalServerErrorException("Error connecting to instance");
        }
    }
    async instanceDisconnect(instanceName: string) {
        try {
            const instance = await this.axiosEvolution.get(`/instance/disconnect/${instanceName}`);
            return instance.data;
        } catch (err: any) {
            throw new InternalServerErrorException("Error disconnecting from instance");
        }
    }
    async instanceLogout(instanceName: string) {
        try {
            const response = await this.axiosEvolution.delete(`/instance/logout/${instanceName}`);
            return response.data;
        } catch (err: any) {
            console.log("Error: ", err.response);
            throw new InternalServerErrorException(
                "Error logging out from instance"
            );
        }
    }
    async instanceDelete(instanceName: string) {
        try {
            const response = await this.axiosEvolution.delete(
                `/instance/delete/${instanceName}`
            );

            return response.data;
        } catch (err: any) {
            console.log("Error: ", err.response);
            throw new InternalServerErrorException(
                "Error deleting instance"
            );
        }
    }
    async sendTextMessage(instanceName: string, number: string, message: string) {
        try {
            const response = await this.axiosEvolution.post(
                `/message/sendText/${instanceName}`,
                {
                    number: number,
                    text: message,
                    // options: {
                    //     delay: 1000, // optional
                    //     presence: "composing" // composing | recording | paused
                    // }
                },
                {
                    headers: {
                        apikey: process.env.EVOLUTION_API_KEY,
                        "Content-Type": "application/json"
                    }
                }
            );

            return response.data;
        } catch (err: any) {
            console.log("Error: ", err.response);
            throw new InternalServerErrorException(
                "Error sending text message"
            );
        }
    }
    async sendMedia(
        instanceName: string,
        number: string,
        mimeType: string,
        mediaType: string,
        fileName: string,
        mediaBase64: string,
        mention?: any
    ) {
        if (!instanceName && !number && !mimeType && !fileName && !mediaBase64) {
            throw new NotFoundException({ message: "Required" });
        }
        const data = {
            number: number,
            mediatype: mediaType,
            mimetype: mimeType,
            media: mediaBase64,
            fileName: fileName,
            delay: 123,
            linkPreview: true,
            mentionsEveryOne: true,
        };
        if (mention) {
            data["caption"] = mention.caption;
            data["mentioned"] = [mention];
            data["quoted"] = {
                key: {
                    id: mention.quotedId
                },
                message: {
                    conversation: mention.conversation
                }
            }
        }
        try {
            const response = await this.axiosEvolution.post(
                `/message/sendMedia/${instanceName}`, data);

            return response.data;
        } catch (err: any) {
            console.log("Error: ", err.response);
            throw new InternalServerErrorException(
                "Error sending media message"
            );
        }
    }
    async setPrecence(instanceName: string) {
        try {
            const response = await this.axiosEvolution.delete(
                `/instance/setPresence/${instanceName}`
            );

            return response.data;
        } catch (err: any) {
            console.log("Error: ", err.response);
            throw new InternalServerErrorException(
                "Error deleting instance"
            );
        }
    }
}

