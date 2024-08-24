import { Controller, Post, Body, Logger, Get, Req, UseGuards, Query, Redirect } from "@nestjs/common"
import { ApiBody, ApiTags } from "@nestjs/swagger"
import { Request } from "express"

import { CreateAuthDto } from "./dto/create-auth.dto"
import { ResetPasswordDto } from "./dto/reset-password.dto"

import { AuthService } from "./auth.service"
import { JwtAuthGuard } from "./guards/jwt.guard"
import { UpdatePasswordDto } from "./dto/update-password.dto"

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

    // auth/update-password
    @Post("update-password")
    @UseGuards(JwtAuthGuard)
    async updatePassword(@Body() data: UpdatePasswordDto) {
        try {
            return this.authService.updatePassword(data)
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

    // auth/confirm
    @Get("confirm")
    @Redirect()
    async confirm(@Query("token") token: string, @Query("redirect_url") redirect_url: string) {
        const result = await this.authService.confirm({ token, redirect_url })

        if (!result.token) {
            this.logger.error("no token found")
        }

        return { url: redirect_url + `?code=${result.token}` }
    }
}
