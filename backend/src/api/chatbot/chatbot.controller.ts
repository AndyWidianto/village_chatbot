import { Body, Controller, Delete, Get, Post, Query, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { ChatbotService } from "./chatbot.service";
import { AuthGuard } from "@nestjs/passport";



@Controller("api")
export class ChatbotController {

    constructor(private service: ChatbotService) { }

    @UseGuards(AuthGuard("jwt"))
    @Post("chatbot")
    async Chatbot(@Body() body: { id: string, message: string }) {
        return this.service.autoreply(body.id, body.message);
    }

    // @UseGuards(AuthGuard("jwt"))
    // @Get("model-ai")
    // async Model() {
    //     try {
    //         const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
    //         const data = await response.json();

    //         console.log("Daftar Model Tersedia:");
    //         data.models.forEach(m => {
    //             console.log(`- Nama: ${m.name}`);
    //             console.log(`  Kemampuan: ${m.supportedGenerationMethods.join(", ")}`);
    //         });
    //         return data;
    //     } catch (error) {
    //         console.error("Gagal ambil list model:", error);
    //     }
    // }
}