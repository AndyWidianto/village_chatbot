import { CreateCitizenDto, UpdateCitizenDto } from "@/lib/dto/citizen.dto";
import { PrismaService } from "@/lib/prisma/prisma.service";
import { PayloadJWT } from "@/lib/types";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { ForbiddenException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ChatPlatform, Citizen, Prisma } from "@prisma/client";
import type { Cache } from "cache-manager";




@Injectable()
export class CitizenService {
    constructor(
        private prisma: PrismaService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) {}

    validateRole(user: PayloadJWT) {
        if (user.role !== "admin") {
            return false;
        }
        return true;
    }
    async create(data: CreateCitizenDto) {
        const dataToSave: Omit<Citizen, "createdAt" |"updatedAt"> = {
            fullName: data.fullName,
            id: data.phoneNumber,
            nik: data.nik,
            platform: data.platform || "WHATSAPP",
            subDistrict: data.subDistrict,
            platformId: data.platformId
        }
        const newCitizen = await this.prisma.citizen.create({
            data: dataToSave
        });
        return newCitizen;
    }
    async update(user: PayloadJWT, id: string, data: UpdateCitizenDto) {
        if (this.validateRole(user)) {
            throw new ForbiddenException("your is not allowed");
        }
        const existing = await this.findOne(id);
        const dataToSave: Partial<Citizen> = {
            ...data.nik ? { nik: data.nik }: {},
            ...data.fullName ? { fullName: data.fullName } : {},
            ...data.subDistrict ? { subDistrict: data.subDistrict } : {}
        }
        const updateCitizen = await this.prisma.citizen.update({
            where: { id: existing.id },
            data: dataToSave
        })
        return updateCitizen;
    }
    async getAll(search?: string, limitStr?: string, lastId?: string, platform?: ChatPlatform) {
        const limit = limitStr ? Number(limitStr) : 10;
        let query: Prisma.CitizenFindManyArgs = {
            where: {
                ...search ? {
                    OR: [
                        { fullName: { contains: search, mode: "insensitive" }},
                        { subDistrict: { contains: search, mode: "insensitive" }}
                    ]
                } : {}
            },
            ...lastId ? {
                cursor: {
                    id: lastId,
                },
                skip: 1
            } : {},
            take: limit,
            orderBy: {
                id: "desc"
            }
        }
        if (platform) {
            query.where = {
                ...query.where,
                platform: platform
            }
        }
        const existingCache = await this.cacheManager.get(`citizens:${search || "all"}:${lastId || "first"}:${limit}:${platform || "all"}`);
        if (existingCache) {
            return existingCache;
        }
        const [citizens, totalCitizen] = await this.prisma.$transaction([
            this.prisma.citizen.findMany(query),
            this.prisma.citizen.count({
                where: query.where
            })
        ]);
        await this.cacheManager.set(`citizens:${search || "all"}:${lastId || "first"}:${limit}:${platform || "all"}`, {
            data: citizens,
            nextId: citizens.length > 0 ? citizens[citizens.length - 1].id : null,
            total: totalCitizen,
            totalPage: Math.ceil(totalCitizen / limit)
        }, 3 * 60 * 1000);
        return {
            data: citizens,
            nextId: citizens.length > 0 ? citizens[citizens.length - 1].id : null,
            total: totalCitizen,
            totalPage: Math.ceil(totalCitizen / limit)
        }
    }
    async findOne(id: string) {
        const existing = await this.prisma.citizen.findUnique({
            where: { id }
        });
        if (!existing) {
            throw new NotFoundException("Citizen not found")
        }
        return existing;
    }
    async delete(user: PayloadJWT, id: string) {
        if (!this.validateRole(user)) {
           throw new ForbiddenException("your is not allowed");
        }
        await this.prisma.citizen.delete({
            where: { id }
        });
        return { message: "delete successfully" }
    }
}