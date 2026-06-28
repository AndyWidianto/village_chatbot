import { PartialType } from "@nestjs/swagger";
import { ComplaintCategory, ComplaintStatus } from "@prisma/client";
import { IsNotEmpty, IsOptional } from "class-validator";


export class CreateCompalintDto {
  @IsNotEmpty({ message: "title is required" })
  title: string;

  @IsOptional()
  description: string;

  @IsNotEmpty({ message: "category is required" })
  category: ComplaintCategory;

  @IsOptional()
  status: ComplaintStatus;

  @IsOptional()
  officerNotes: string;

  @IsNotEmpty({ message: "citizenId is required" })
  citizenId: string;
}

export class UpdateComplaintDto extends PartialType(CreateCompalintDto) { }