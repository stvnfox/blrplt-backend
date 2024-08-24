import { IsString, MinLength } from "class-validator";

export class UpdatePasswordDto {
    @IsString()
    @MinLength(6)
    password: string

    @IsString()
    access_token: string

    @IsString()
    refresh_token: string
}