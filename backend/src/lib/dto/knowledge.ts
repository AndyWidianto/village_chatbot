import { PartialType } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";



export class CreateKnowledgeDto { 

    @IsNotEmpty({ message: "field name is required" })
    name: string;

    @IsOptional()
    content?: string;
}


export class UpdateKnowledgeDto extends PartialType(CreateKnowledgeDto) {}