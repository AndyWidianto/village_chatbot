import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../lib/prisma/prisma.service';
import { EvolutionService } from '@/lib/evolutions/evolutions.service';
import { CreateDevice, PayloadJWT } from '@/lib/types';
import { TypeNotification } from '@/lib/shared/notification';


@Injectable()
export class DeviceService {
  constructor(
    private prisma: PrismaService,
    private evolution: EvolutionService
  ) { }

  async create(user: PayloadJWT, { name, instanceName }: CreateDevice) {
    const instance = await this.evolution.createInstance({ instanceName });
    const newDevice = await this.prisma.device.create({
      data: { id: instance.instance.instanceId, name, instanceName }
    });
    await this.setWebhook(instanceName, `api/webhook/${newDevice.id}`);
    await this.prisma.notification.create({
      data: {
        title: `delete autoreply`,
        content: JSON.stringify(instance),
        type: TypeNotification.success,
        isRead: false,
        userId: user.id
      }
    });
    return {
      ...newDevice,
      status: instance?.connectionStatus ?? 'disconnected',
      instanceName: instance?.name ?? newDevice.instanceName,
      integration: instance?.integration ?? 'UNKNOWN'
    };
  }

  async setWebhook(instanceName: string, url: string) {
    const baseUrl = process.env.BASE_URL;
    await this.evolution.setWebhook({ instance: instanceName, url: `${baseUrl}/${url}` });
    return { message: "Setting webhook successfully" }
  }

  async connectDevice(id: string) {
    const device = await this.getOne(id)
    const instance = await this.evolution.instanceConnect(device.instanceName);
    return instance;
  }

  async getAll() {
    const devices = await this.prisma.device.findMany({
      orderBy: { createdAt: 'desc' },
    });
    const instances = await this.evolution.getInstances();

    const instanceMap = new Map(instances.map((i: any) => [i.id, i]));

    return devices.map(device => {
      const instance: any = instanceMap.get(device.id);

      return {
        ...device,
        status: instance?.connectionStatus ?? 'disconnected',
        instanceName: instance?.name ?? device.instanceName,
        integration: instance?.integration ?? 'UNKNOWN'
      };
    });
  }

  async getOne(id: string) {
    const existing = await this.prisma.device.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException("device not found");
    }
    return existing;
  }

  async delete(user: PayloadJWT,id: string) {
    const device = await this.getOne(id);
    await this.evolution.instanceDelete(device.instanceName);
    await this.prisma.device.delete({
      where: { id: device.id }
    })
    await this.prisma.notification.create({
      data: {
        title: `delete autoreply`,
        content: JSON.stringify(device),
        type: TypeNotification.success,
        isRead: false,
        userId: user.id
      }
    });
    return { message: "Delete device successfully" };
  }
}