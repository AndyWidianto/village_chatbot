import { CreateKnowledgeDto, UpdateKnowledgeDto } from "../../lib/dto/knowledge";
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { FileInterceptor } from "@nestjs/platform-express";
import { KnowledgeService } from "./knowledge.service";
import type { RequestAndPayload } from "../../lib/types";


@Controller("api/knowledges")
export class KnowledgeController {
    constructor(private service: KnowledgeService) { }

    @UseGuards(AuthGuard("jwt"))
    @Post()
    @UseInterceptors(FileInterceptor("file"))
    async CreateKnowledgeAI(@Req() req: RequestAndPayload, @Body() body: CreateKnowledgeDto, @UploadedFile("file") file?: Express.Multer.File) {
        const user = req.user;
        return this.service.createKnowledge(user, { ...body, file });
    }

    @UseGuards(AuthGuard("jwt"))
    @Delete(":id")
    async deleteKnowlege(@Req() req: RequestAndPayload, @Param("id") id: string) {
        const user = req.user;
        return this.service.deleteKnowledge(user, id);
    }

    @UseGuards(AuthGuard("jwt"))
    @Patch(":id")
    async updateKnowledge(@Req() req: RequestAndPayload, @Param("id") id: string, @Body() body: UpdateKnowledgeDto) {
        const user = req.user;
        return this.service.updateKnowledge(user, id, body);
    }

    @UseGuards(AuthGuard("jwt"))
    @Get()
    async Knowledges(@Query() query: { lastId: string, limit: string, search: string }) {
        return this.service.getAllKnowledge(query.lastId, query.limit, query.search);
    }
}