import { Module } from "@nestjs/common";
import { EventGateway } from "./event.gateway";
import { JwtModule } from "@nestjs/jwt";



@Module({
    providers: [EventGateway],
    exports: [EventGateway],
    imports: [
        JwtModule.register({
            secret: process.env.SECRET_ACCESS_TOKEN!
        })
    ]
})
export class EventModule {}