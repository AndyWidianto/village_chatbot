import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { DeviceService } from './device.service';
import { CreateDeviceDto } from '@/lib/dto/device.dto';
import { AuthGuard } from '@nestjs/passport';


@Controller('api/devices')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

    @Post()
    @UseGuards(AuthGuard("jwt"))
    async create(@Body() createDeviceDto: CreateDeviceDto) {
        return this.deviceService.create(createDeviceDto);
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
    async deleteDevice(@Param("id") id: string) {
        return this.deviceService.delete(id);
    }
}
