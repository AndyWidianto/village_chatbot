import { PrismaService } from "@/lib/prisma/prisma.service";
import { CreateUser, PayloadUser, ResetPassword } from "@/lib/types";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import bcrypt from "bcryptjs";




@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }


    async findOne(id: string) {
        const existing = await this.prisma.user.findFirst({
            where: { id }
        });
        if (!existing) {
            throw new NotFoundException("User not found");
        }
        return existing;
    }
    async updateUser(user: PayloadUser, data: Partial<CreateUser>) {
        let dataToSend = { ...data };
        const existing = await this.findOne(user.id);
        if (user.role !== "super_admin" && user.role) {
            delete dataToSend.role;
        }
        return this.prisma.user.update({
            where: { id: existing.id },
            data: { ...dataToSend },
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                name: true
            }
        })
    }

    async resetPassword(id: string, data: ResetPassword) {
        const user = await this.findOne(id);
        const passwordValid = await bcrypt.compare(data.password, user.password);
        if (!passwordValid) {
            throw new BadRequestException("Password tidak valid");
        }
        const newPassword = await bcrypt.hash(data.newPassword, 10);
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                password: newPassword
            }
        });
        return { message: "Update password successfully" }
    }
    async getStats() {
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const [active, total] = await Promise.all([
            this.prisma.user.count({
                where: {
                    updatedAt: {
                        gte: twentyFourHoursAgo, 
                    },
                },
            }),
            this.prisma.user.count(),
        ]);

        return {
            active,
            inactive: total - active,
            total,
        };
    }
}