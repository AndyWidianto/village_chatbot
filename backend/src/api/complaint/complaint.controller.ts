import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { ComplaintService } from "./complaint.service";
import type { RequestAndPayload } from "@/lib/types";
import { AuthGuard } from "@nestjs/passport";
import { UpdateComplaintDto } from "@/lib/dto/complaint.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { ComplaintCategory, ComplaintStatus } from "@prisma/client";


@Controller("api/complaints")
export class ComplaintController {
    constructor(
        private service: ComplaintService
    ) {}

    @Get()
    async getAll(@Query() query: { search?: string, lastId?: string, limit?: string }) {
        return await this.service.getAll(query.search, query.lastId, query.limit);
    }
    @Get("/search")
    async getComplaints(@Query() query: { search?: string, lastId?: string, limit?: string, order?: "asc" | "desc", status?: ComplaintStatus, category?: ComplaintCategory }) {
        return await this.service.getComplaints(query.search, query.limit, query.lastId, query.order, query.status, query.category);
    }

    @Patch(":id")
    @UseGuards(AuthGuard("jwt"))
    async update(@Req() req: RequestAndPayload, @Param("id") id: string, @Body() body: UpdateComplaintDto) {
        const user = req.user;
        return await this.service.update(user, id, body);
    }
    
    @Post(":id/upload")
    @UseGuards(AuthGuard("jwt"))
    @UseInterceptors(FileInterceptor("file"))
    async uploadFile(@Req() req: RequestAndPayload, @Param("id") id: string, @UploadedFile("file") file: Express.Multer.File) {
        const user = req.user;
        return await this.service.uploadFile(user, id, file);
    }

    @Get(":ticketNumber")
    async getComplaint(@Param("ticketNumber") ticketNumber: string) {
        return await this.service.getComplaint(ticketNumber);
    }


    @Delete(":id")
    @UseGuards(AuthGuard("jwt"))
    async delete(@Param("id") id: string, @Req() req: RequestAndPayload) {
        const user = req.user;
        return await this.service.delete(user, id);
    }
}