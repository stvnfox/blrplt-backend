const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3210",
    "https://blrplt-builder.vercel.app",
    // "https://blrplt-builder-staging.vercel.app",
    "https://blrplt-backend.vercel.app",
    "https://blrplt-backend-staging.vercel.app",
]

export const corsOptions = {
    origin: (origin: string, callback) => {
        console.log('allowedOrigins: ', allowedOrigins)
        console.log('origin: ', origin)
        console.log(!origin)
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error("Not allowed by CORS"))
        }
    },
    optionsSuccessStatus: 200,
}
