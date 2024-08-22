import { NestFactory } from "@nestjs/core"
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger"
import { AppModule } from "./app.module"
import { corsOptions } from "../lib/cors"

async function bootstrap() {
    const app = await NestFactory.create(AppModule)

    // swagger setup
    const config = new DocumentBuilder()
        .setTitle("blrplt builder api")
        .setDescription("the blrplt builder api documentation")
        .setVersion("1.0")
        .addBearerAuth({ in: "header", type: "http", scheme: "bearer", bearerFormat: "JWT" }, "access-token")
        .build()

    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup("docs", app, document)

    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');
        next();
    });
    
    //corsOptions
    app.enableCors({
        origin: [
            "http://localhost:3000",
            "http://localhost:3210",
            "https://blrplt-builder.vercel.app",
            "https://blrplt-builder-staging.vercel.app",
            "https://blrplt-backend.vercel.app",
            "https://blrplt-backend-staging.vercel.app",
        ],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
        optionsSuccessStatus: corsOptions.optionsSuccessStatus,
    })
    await app.listen(3210)
}
bootstrap()
