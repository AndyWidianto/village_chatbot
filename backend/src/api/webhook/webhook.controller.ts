import { Body, Controller, Param, Post, Req } from "@nestjs/common";
import { WebhookService } from "./webhook.service";
import type { Request } from "express";



@Controller("api/webhook")
export class WebhookController {

    constructor(private service: WebhookService) {}

    @Post(':id')
    async Webhook(@Body() body: any, @Param("id") id: string) {
        return this.service.webhook(id, body);
    }
}