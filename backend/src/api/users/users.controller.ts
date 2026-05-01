import { ResetPasswordDto, UpdateUserDto } from "@/lib/dto/user.dto";
import { Body, Controller, Delete, Get, Patch, Post, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { UsersService } from "./users.service";
import { AuthGuard } from "@nestjs/passport";
import type { RequestAndPayload } from "@/lib/types";
import { FileInterceptor } from "@nestjs/platform-express";



@Controller("api/users")
export class UsersController {

    constructor(private service: UsersService) { }

    @Post()
    async createUser() { }

    @Patch()
    @UseGuards(AuthGuard("jwt"))
    async updateUser(@Req() req: RequestAndPayload, @Body() body: UpdateUserDto) {
        const user = req.user;
        return this.service.updateUser(user, body);
    }

    @Delete()
    async deleteUser() { }

    @Post("reset-password")
    @UseGuards(AuthGuard("jwt"))
    async resetPassword(@Req() req: RequestAndPayload, @Body() body: ResetPasswordDto) {
        const userId = req.user.id;
        return this.service.resetPassword(userId, body);
    }

    @Get("stats")
    @UseGuards(AuthGuard("jwt"))
    async getStats() {
        return this.service.getStats();
    }
    
    @Post("upload")
    @UseGuards(AuthGuard("jwt"))
    @UseInterceptors(FileInterceptor("file"))
    async uploadProfile(@Req() req: RequestAndPayload, @UploadedFile("file") file: Express.Multer.File) {
        const user = req.user;
        return this.service.uploadProfile(user, file);
    }
}