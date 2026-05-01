import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { DeviceService } from './device.service';
import { CreateDeviceDto } from '../../lib/dto/device.dto';
import { AuthGuard } from '@nestjs/passport';
import type { RequestAndPayload } from '../../lib/types';


@Controller('api/devices')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

    @Post()
    @UseGuards(AuthGuard("jwt"))
    async create(@Req() req: RequestAndPayload, @Body() createDeviceDto: CreateDeviceDto) {
        const user = req.user;
        return this.deviceService.create(user, createDeviceDto);
    }

    @Get()
    @UseGuards(AuthGuard("jwt"))
    async getAll() {
        return this.deviceService.getAll();
    }

    @Post("connection/:id")
    @UseGuards(AuthGuard("jwt"))
    async connectionDevice(@Param("id") id: string) {
        return this.deviceService.connectDevice(id);
    }

    @Delete(":id")
    @UseGuards(AuthGuard("jwt"))
    async deleteDevice(@Req() req: RequestAndPayload ,@Param("id") id: string) {
        const user = req.user;
        return this.deviceService.delete(user, id);
    }
}
