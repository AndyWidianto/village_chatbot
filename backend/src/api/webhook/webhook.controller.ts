import { Body, Controller, Param, Post, Req, Res } from "@nestjs/common";
import { WebhookService } from "./webhook.service";
import type { Response } from "express";
import path from "path";
import fs from "fs/promises";



@Controller("api/webhook")
export class WebhookController {
    private readonly filePath = path.join(process.cwd(), 'data.json');
    private currentLogs: any = [];

    constructor(private service: WebhookService) { }

@Post(':id')
async Webhook(@Body() body: any, @Param("id") id: string, @Res() res: Response) {
    res.status(200).json({ message: "successfully" });
    this.service.webhook(id, body).catch(err => {
        console.error("Error dalam memproses webhook di background:", err);
    });
}

    private async logResponseToJson(newData: any) {
        try {
            const fileContent = await fs.readFile(this.filePath, 'utf-8');
            this.currentLogs = JSON.parse(fileContent as any);
        } catch (error) {
        }
        const logEntry = {
            timestamp: new Date().toISOString(),
            ...newData
        };
        this.currentLogs.push(logEntry);
        await fs.writeFile(this.filePath, JSON.stringify(this.currentLogs, null, 2), 'utf-8');
    }
}