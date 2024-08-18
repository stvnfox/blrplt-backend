import { Controller, Post, Body, Logger, Get, Req, UseGuards } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { CreateAuthDto } from "./dto/create-auth.dto"
// import { UpdateAuthDto } from './dto/update-auth.dto';
import { ApiBody, ApiTags } from "@nestjs/swagger"
import { JwtAuthGuard } from "./guards/jwt.guard"
import { Request } from "express"
import { ResetPasswordDto } from "./dto/reset-password.dto"

@Controller("auth")
@ApiTags("auth")
export class AuthController {
    private readonly logger = new Logger(AuthController.name)
    constructor(private readonly authService: AuthService) {}

    // auth/register
    @Post("register")
    @ApiBody({ type: CreateAuthDto, description: "Register a new user" })
    async register(@Body() data: CreateAuthDto) {
        try {
            return this.authService.register(data)
        } catch (error) {
            this.logger.error(error)
        }
    }

    // auth/login
    @Post("login")
    @ApiBody({ type: CreateAuthDto, description: "Login a user" })
    async login(@Body() data: CreateAuthDto) {
        try {
            return this.authService.login(data)
        } catch (error) {
            this.logger.error(error)
        }
    }

    // auth/logout
    @Post("logout")
    async logout() {
        try {
            return this.authService.logout()
        } catch (error) {
            this.logger.error(error)
        }
    }

    // auth/reset-password
    @Post("reset-password")
    async resetPassword(@Body() data: ResetPasswordDto) {
        try {
            return this.authService.resetPassword(data)
        } catch (error) {
            this.logger.error(error)
        }
    }

    // auth/status
    @Get("status")
    @UseGuards(JwtAuthGuard)
    async status(@Req() req: Request) {
        return req.user
    }

    // @Get()
    // findAll() {
    //   return this.authService.findAll();
    // }

    // @Get(':id')
    // findOne(@Param('id') id: string) {
    //   return this.authService.findOne(+id);
    // }

    // @Patch(':id')
    // update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    //   return this.authService.update(+id, updateAuthDto);
    // }

    // @Delete(':id')
    // remove(@Param('id') id: string) {
    //   return this.authService.remove(+id);
    // }
}
