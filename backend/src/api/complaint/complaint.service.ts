import { CloudinaryService } from "@/lib/cloudinary/cloudinary.service";
import { CreateCompalintDto, UpdateComplaintDto } from "@/lib/dto/complaint.dto";
import { PrismaService } from "@/lib/prisma/prisma.service";
import { PayloadJWT } from "@/lib/types";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";


@Injectable()
export class ComplaintService {

    constructor(
        private prisma: PrismaService,
        private cloudinary: CloudinaryService
    ) { }

    validateRole(user: PayloadJWT) {
        if (user.role !== "admin") {
            return false;
        }
        return true;
    }
    generateRandomId(min = 10000000, max = 99999999) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    async create(data: CreateCompalintDto) {
        const tiketNumber = this.generateRandomId();
        const complaint = await this.prisma.complaint.create({
            data: {
                ...data,
                ticketNumber: tiketNumber.toString()
            }
        })
        return complaint;
    }
    async update(user: PayloadJWT, id: string, data: UpdateComplaintDto) {
        if (!this.validateRole(user)) {
            throw new BadRequestException("Your is not allowed");
        }
        const existing = await this.findOne(id);
        const compalintUpdate = await this.prisma.complaint.update({
            where: { id: existing.id },
            data: data
        });
        return compalintUpdate;
    }
    async uploadFile(user: PayloadJWT, id: string, file: Express.Multer.File) {
        if (!this.validateRole(user)) {
            throw new BadRequestException("Your is not allowed");
        }
        const existing = await this.findOne(id);
        let image: null | { publicId: string, attachmentUrl: string } = null;
        const fileName = `${Date.now()}-${file.filename}`;
        const saveImage = await this.cloudinary.uploadFile(fileName, file);
        image = {
            publicId: saveImage.public_id,
            attachmentUrl: saveImage.url
        }
        if (existing.attachmentUrl && existing.publicId) {
            await this.cloudinary.deleteFile(existing.publicId);
        }
        const compalintUpdate = await this.prisma.complaint.update({
            where: { id: existing.id },
            data: image
        });
        return compalintUpdate;
    }
    async getAll(search?: string, lastId?: string, limitStr?: string) {
        const limit = limitStr ? Number(limitStr) : 10;
        let query: Prisma.ComplaintFindManyArgs = {
            where: {
                ...search ? {
                    title: { contains: search, mode: "insensitive" },
                    description: { contains: search, mode: "insensitive" },
                    ticketNumber: { contains: search, mode: "insensitive" },
                } : {},
            },
            ...lastId ? {
                cursor: { id: lastId },
                skip: 1,
            } : {},
            take: limit,
            orderBy: {
                id: "desc"
            }
        };
        const [complaints, totalComplaint] = await this.prisma.$transaction([
            this.prisma.complaint.findMany(query),
            this.prisma.complaint.count({
                where: query.where
            })
        ]);
        return {
            data: complaints,
            total: totalComplaint,
            totalPage: Math.ceil(totalComplaint / limit),
            nextId: complaints.length > 0 ? complaints[complaints.length - 1].id : null
        }
    }
    async findOne(id: string) {
        const existing = await this.prisma.complaint.findUnique({
            where: { id }
        });
        if (!existing) {
            throw new NotFoundException("complaint is not found");
        }
        return existing;
    }

    async delete(user: PayloadJWT, id: string) {
        if (!this.validateRole(user)) {
            throw new BadRequestException("Your is not allowed");
        }
        const existing = await this.findOne(id);
        await this.prisma.complaint.delete({
            where: { id: existing.id }
        });
        return { message: "delete Complaint Successfully" };
    }

    async getComplaint(ticketNumber: string) {
        const complaint = await this.prisma.complaint.findFirst({
            where: {
                ticketNumber: ticketNumber
            },
            include: {
                citizen: {
                    select: {
                        id: true,
                        createdAt: true,
                        updatedAt: true,
                        fullName: true,
                        platformId: true,
                        platform: true,
                        subDistrict: true,
                    }
                }
            }
        });
        if (!complaint) {
            throw new NotFoundException("Complaint not found");
        }
        return complaint;
    }

    async getComplaints(search?: string, limitStr?: string, lastId?: string, order?: "asc" | "desc") {
        const limit = limitStr ? Number(limitStr) : 10;
        let query: Prisma.ComplaintFindManyArgs = {
            where: {
                ...(search ? {
                    OR: [
                        { description: { contains: search, mode: "insensitive" } },
                        { officerNotes: { contains: search, mode: "insensitive" } },
                        { ticketNumber: { contains: search, mode: "insensitive" } },
                        { title: { contains: search, mode: "insensitive" } } // Tambahan: Biasanya judul juga ikut dicari
                    ]
                } : {})
            },
            ...(lastId ? {
                cursor: {
                    id: lastId
                },
                skip: 1,
            } : {}),
            take: limit,
            orderBy: {
                createdAt: order || "desc"
            },
            select: {
                id: true,
                ticketNumber: true,
                title: true,
                description: true,
                category: true,
                status: true,
                attachmentUrl: true,
                officerNotes: true,
                citizenId: true,
                createdAt: true,
                updatedAt: true,
                citizen: {
                    select: {
                        id: true,
                        fullName: true,
                        platformId: true,
                        platform: true,
                        subDistrict: true,
                        createdAt: true,
                        updatedAt: true,
                    }
                }
            }
        };
        const [complaints, totalComplaint] = await this.prisma.$transaction([
            this.prisma.complaint.findMany(query),
            this.prisma.complaint.count({
                where: query.where
            })
        ]);
        return {
            data: complaints,
            total: totalComplaint,
            totalPage: Math.ceil(totalComplaint / limit),
            nextId: complaints.length > 0 ? complaints[complaints.length - 1].id : null
        }
    }
}