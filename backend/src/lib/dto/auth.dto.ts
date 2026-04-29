import { IsEmail, IsNotEmpty, Matches, MinLength } from "class-validator";

export class LoginDto {
    @IsNotEmpty({ message: 'Email tidak boleh kosong' })
    @IsEmail()
    email: string;

    @IsNotEmpty({ message: 'Password tidak boleh kosong' })
    password: string;
}

export class RegisterDto {
    @IsNotEmpty()
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
}