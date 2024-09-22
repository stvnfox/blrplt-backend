import { Module } from "@nestjs/common"
import { AuthModule } from "./auth/auth.module"
import { ConfigModule } from "@nestjs/config"
import { PageModule } from "./page/page.module"
import { DatabaseModule } from "./database/database.module"

@Module({
    imports: [AuthModule, ConfigModule.forRoot(), PageModule, DatabaseModule],
})
export class AppModule {}
