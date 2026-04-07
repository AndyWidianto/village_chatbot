import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { DeviceService } from './device.service';


@Controller('api/device')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

    @Post()
    create(@Body() createDeviceDto: any) {
        return this.deviceService.create(createDeviceDto);
    }

    @Get()
    getAll(@Query() query: { cursor?: string, limitStr?: string, offsetStr?: string }) {
        return this.deviceService.getAll(query);
    }
}
