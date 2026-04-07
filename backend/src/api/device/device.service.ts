import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../lib/prisma/prisma.service';


@Injectable()
export class DeviceService {
  constructor(
    private prisma: PrismaService
  ) { }

  async create(createDeviceDto: any) {
    return this.prisma.device.create({
      data: {
        ...createDeviceDto,
        status: "CONNECTING"
      }
    });
  }

  async getAll({ cursor, limitStr, offsetStr }: { cursor?: string, limitStr?: string, offsetStr?: string }) {
    const limit = limitStr ? parseInt(limitStr) : 10;
    const offset = offsetStr ? parseInt(offsetStr) : 0;
    return this.prisma.device.findMany({
      take: limit,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: 'desc' },
      skip: 1,
    });
  }
}