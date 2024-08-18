import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common"
import { CreateAuthDto } from "./dto/create-auth.dto"
// import { UpdateAuthDto } from './dto/update-auth.dto';
import { createClient, SupabaseClient } from "@supabase/supabase-js"
import { hashPassword } from "../../lib/passwords"
import { JwtService } from "@nestjs/jwt"

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
        if(users.find(user => user.email === createAuthDto.email)) {
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

    // create(createAuthDto: CreateAuthDto) {
    //   return 'This action adds a new auth';
    // }

    // findAll() {
    //   return `This action returns all auth`;
    // }

    // findOne(id: number) {
    //   return `This action returns a #${id} auth`;
    // }

    // update(id: number, updateAuthDto: UpdateAuthDto) {
    //   return `This action updates a #${id} auth`;
    // }

    // remove(id: number) {
    //   return `This action removes a #${id} auth`;
    // }
}
