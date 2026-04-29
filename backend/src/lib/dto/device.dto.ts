import { IsNotEmpty } from "class-validator";



export class CreateDeviceDto {
    @IsNotEmpty({ message: "field name is required"})
    name: string;

    @IsNotEmpty({ message: "field instanceName is required"})
    instanceName: string;
}