const allowedOrigins = ["http://localhost:3000", "http://localhost:3210"];

export const corsOptions = {
    origin: (origin: string, callback) => {
        if(allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error("Not allowed by CORS"))
        }
    },
    optionsSuccessStatus: 200,
}