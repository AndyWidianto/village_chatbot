import { PartialType } from "@nestjs/swagger";
import { ChatPlatform } from "@prisma/client";
import { IsNotEmpty, IsOptional } from "class-validator";


export class CreateCitizenDto {
    @IsNotEmpty({ message: "phoneNumber is required" })
    phoneNumber: string;

    @IsOptional()
    nik: string;

    @IsNotEmpty({ message: "fullName is required" })
    fullName: string;

    @IsNotEmpty({ message: "platform is required" })
    platform: ChatPlatform;

    @IsNotEmpty({ message: "platformId is required" })
    platformId: string;

    @IsOptional()
    subDistrict: string;
}

export class UpdateCitizenDto extends PartialType(CreateCitizenDto) {}