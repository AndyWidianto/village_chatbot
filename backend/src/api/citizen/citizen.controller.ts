import { Body, Controller, Delete, Get, Param, Patch, Query, Req, UseGuards } from "@nestjs/common";
import { CitizenService } from "./citizen.service";
import { ChatPlatform } from "@prisma/client";
import { UpdateCitizenDto } from "@/lib/dto/citizen.dto";
import type { RequestAndPayload } from "@/lib/types";
import { AuthGuard } from "@nestjs/passport";



@Controller("api/citizens")
export class CitizenController {
    constructor(
        private service: CitizenService
    ) {}

    @Get()
    @UseGuards(AuthGuard("jwt"))
    async getAll(@Query() query: { search?: string, lastId?: string, limit?: string, platform: ChatPlatform }) {
        return await this.service.getAll(query.search, query.limit, query.lastId, query.platform);
    }

    @Patch(":id")
    @UseGuards(AuthGuard("jwt"))
    async update(@Req() req: RequestAndPayload, @Param("id") id: string, @Body() body: UpdateCitizenDto) {
        const user = req.user;
        return await this.service.update(user, id, body);
    }

    @Delete(":id")
    @UseGuards(AuthGuard("jwt"))
    async delete(@Param("id") id: string, @Req() req: RequestAndPayload) {
        const user = req.user;
        return await this.service.delete(user, id);
    }
}