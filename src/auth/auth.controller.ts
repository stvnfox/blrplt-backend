import { Controller, Post, Body, Logger } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { CreateAuthDto } from "./dto/create-auth.dto"
// import { UpdateAuthDto } from './dto/update-auth.dto';
import { ApiBody, ApiTags } from "@nestjs/swagger"

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
