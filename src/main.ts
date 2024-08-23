import { NestFactory } from "@nestjs/core"
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger"
import { AppModule } from "./app.module"
import { corsOptions } from "../lib/cors"

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { cors: true })

    // swagger setup
    const config = new DocumentBuilder()
        .setTitle("blrplt builder api")
        .setDescription("the blrplt builder api documentation")
        .setVersion("1.0")
        .addBearerAuth({ in: "header", type: "http", scheme: "bearer", bearerFormat: "JWT" }, "access-token")
        .build()

    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup("docs", app, document)

    app.use(function (req, res, next) {
        req.headers.origin = req.headers.origin || req.headers.host;
        console.log('req.headers.origin: ', req.headers.origin)
        next();
    });

    //corsOptions
    app.enableCors(corsOptions)
    await app.listen(3210)
}
bootstrap()
