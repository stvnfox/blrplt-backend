import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { createClient, SupabaseClient } from "@supabase/supabase-js"

import { CreateAuthDto } from "./dto/create-auth.dto"
import { UpdatePasswordDto } from "./dto/update-password.dto"
import { ResetPasswordDto } from "./dto/reset-password.dto"

import { hashPassword } from "../../lib/passwords"

@Injectable()
export class AuthService {
    private logger = new Logger(AuthService.name)
    private supabaseClient: SupabaseClient

    constructor(private jwtService: JwtService) {
        this.supabaseClient = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ADMIN)
    }

    async getUsers() {
        const { data, error } = await this.supabaseClient.auth.admin.listUsers({ page: 1, perPage: 1000 })
        if (error) {
            this.logger.error(error)
            throw new HttpException(
                {
                    status: error.status,
                    message: error.message,
                },
                HttpStatus.BAD_REQUEST,
                {
                    cause: error,
                }
            )
        }

        const users = data.users || []
        return users
    }

    async register(createAuthDto: CreateAuthDto) {
        // check if user already exists and throw an error if they do
        const users = await this.getUsers()
        if (users.find((user) => user.email === createAuthDto.email)) {
            throw new HttpException(
                {
                    status: HttpStatus.CONFLICT,
                    message: `User with email ${createAuthDto.email} already exists`,
                },
                HttpStatus.CONFLICT
            )
        }

        // create a new user
        const password = await hashPassword(createAuthDto.password)
        const { data, error } = await this.supabaseClient.auth.signUp({
            email: createAuthDto.email,
            password: password,
        })

        if (error) {
            this.logger.error(error)
            throw new HttpException(
                {
                    status: error.status,
                    message: error.message,
                },
                HttpStatus.BAD_REQUEST,
                {
                    cause: error,
                }
            )
        }

        this.logger.log(`User registered successfully with email: ${createAuthDto.email}`)
        return data
    }

    async login(loginAuthDto: CreateAuthDto) {
        const { data, error } = await this.supabaseClient.auth.signInWithPassword({
            email: loginAuthDto.email,
            password: loginAuthDto.password,
        })

        if (error) {
            this.logger.error(error)
            throw new HttpException(
                {
                    status: error.status,
                    message: error.message,
                },
                HttpStatus.BAD_REQUEST,
                {
                    cause: error,
                }
            )
        }

        // log the successful login for email
        this.logger.log(`User logged in successfully with email: ${loginAuthDto.email}`)

        // sign the access token and return it
        this.jwtService.sign(data.session.access_token)
        return data.session.access_token
    }

    async logout() {
        const { error } = await this.supabaseClient.auth.signOut()

        if (error) {
            this.logger.error(error)
            throw new HttpException(
                {
                    status: error.status,
                    message: error.message,
                },
                HttpStatus.BAD_REQUEST,
                {
                    cause: error,
                }
            )
        }

        this.logger.log(`User logged out successfully`)
    }

    async resetPassword(resetPasswordDto: ResetPasswordDto) {
        const { error } = await this.supabaseClient.auth.resetPasswordForEmail(resetPasswordDto.email, {
            redirectTo: `${process.env.BASE_REDIRECT_URL}/update-password`,
        })

        if (error) {
            this.logger.error(error)
            throw new HttpException(
                {
                    status: error.status,
                    message: error.message,
                },
                HttpStatus.BAD_REQUEST,
                {
                    cause: error,
                }
            )
        }

        this.logger.log(`Password reset email sent to ${resetPasswordDto.email}`)
        return { message: "succeeded" }
    }

    async updatePassword(updatePasswordDto: UpdatePasswordDto) {
        const { error } = await this.supabaseClient.auth.updateUser({
            password: updatePasswordDto.password,
        })

        if (error) {
            this.logger.error(error)
            switch (error.code) {
                case "same_password":
                    throw new HttpException(
                        {
                            status: HttpStatus.CONFLICT,
                            message: "new password should be different from the old password",
                        },
                        HttpStatus.CONFLICT,
                        {
                            cause: error,
                        }
                    )
                default:
                    throw new HttpException(
                        {
                            status: HttpStatus.BAD_REQUEST,
                            message: "something went wrong",
                        },
                        HttpStatus.BAD_REQUEST,
                        {
                            cause: error,
                        }
                    )
            }
        }

        this.logger.log(`Password updated successfully`)
        return { message: "your password is succesfully changed!" }
    }
}
