import { Injectable, Logger } from '@nestjs/common';

import { DatabaseService } from 'src/database/database.service';

import { UpdatePageDto } from './dto/update-page.dto';

@Injectable()
export class PageService {
  private readonly logger = new Logger(PageService.name);

  constructor(private readonly databaseService: DatabaseService) {}

  async update(updatePageDto: UpdatePageDto) {
    const site = await this.databaseService.site.findUnique({
      where: {
        id: updatePageDto.siteId,
      },
      select: {
        pages: true,
      }
    });

    if (!site) {
      throw new Error('Site not found');
    }

    // Using any on page because types are not working with jsonb schema
    const updatedPages = site.pages.map((page: any) => {
      if (page?.id === updatePageDto.pageId) {
        return { ...page, components: updatePageDto.components };
      }
      return page;
    })

    const response = await this.databaseService.site.update({
      where: {
        id: updatePageDto.siteId,
      },
      data: {
        pages: updatedPages,
      },
    });

    this.logger.log('response: ' + response);

    return Response.json(response)
  }
}
