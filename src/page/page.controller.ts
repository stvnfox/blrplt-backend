import { Controller, Post, Body, Logger, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';

import { UpdatePageDto } from './dto/update-page.dto';

import { PageService } from './page.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('page')
@ApiTags('page')
export class PageController {
  private readonly logger = new Logger(PageController.name);
  constructor(private readonly pageService: PageService) {}

  // page/update
  @Post("update")
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: UpdatePageDto, description: "Update a page" })
  async update(@Body() updatePageDto: UpdatePageDto) {
    try {
      return await this.pageService.update(updatePageDto);
    } catch (error) {
      this.logger.error(error);
      
      throw new HttpException(
        {
            status: HttpStatus.NOT_FOUND,
            message: "User not found",
        },
        HttpStatus.NOT_FOUND,
        {
            cause: error,
        }
    )
    }
  }

  // page/get
  // @Get("get")
  // @UseGuards(JwtAuthGuard)
  // async get() {
  //   return this.pageService.findAll();
  // }

  // @Get()
  // findAll() {
  //   return this.pageService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.pageService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updatePageDto: UpdatePageDto) {
  //   return this.pageService.update(+id, updatePageDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.pageService.remove(+id);
  // }
}
