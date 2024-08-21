import { IsString } from "class-validator";

export class ConfirmDto {
    @IsString()
    token: string

    @IsString()
    redirect_url: string
}