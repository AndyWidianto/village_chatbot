import { OmitType, PartialType } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { IsEmail, IsNotEmpty, Matches, MinLength } from "class-validator";


export class CreateUserDto {
    @IsNotEmpty({ message: 'Name tidak boleh kosong' })
    name: string;

    @IsNotEmpty({ message: 'username tidak boleh kosong' })
    username: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty({ message: 'Password tidak boleh kosong' })
    @MinLength(8, { message: 'Password minimal harus 8 karakter' })
    @Matches(/[A-Z]/, {
        message: 'Password harus mengandung setidaknya satu huruf besar'
    })
    password: string;

    @IsNotEmpty({ message: 'Role tidak boleh kosong' })
    role: UserRole;
}

export class UpdateUserDto extends PartialType(OmitType(CreateUserDto, ["password"])) { }


export class ResetPasswordDto {
    @IsNotEmpty({ message: 'Password tidak boleh kosong' })
    @MinLength(8, { message: 'Password minimal harus 8 karakter' })
    @Matches(/[A-Z]/, {
        message: 'Password harus mengandung setidaknya satu huruf besar'
    })
    password: string;

    @IsNotEmpty({ message: 'Password baru tidak boleh kosong' })
    @MinLength(8, { message: 'Password baru minimal harus 8 karakter' })
    @Matches(/[A-Z]/, {
        message: 'Password baru harus mengandung setidaknya satu huruf besar'
    })
    newPassword: string;
}
