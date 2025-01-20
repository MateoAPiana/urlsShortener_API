import express from "express"
import morgan from "morgan"
import URLrouter from "./routes/url.routes"
import cookieParser from "cookie-parser"
import jwt from "jsonwebtoken"
import userRouter from "./routes/user.routes"
import { corsMiddleware } from "./middleware/cors"
import "./types.d"

const app = express()

const PORT = process.env.PORT || 3000

app.disable('x-powered-by')
app.use(corsMiddleware())

app.use(express.json())
app.use(cookieParser())
app.use(morgan("dev"))

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received. Closing server.');
  server.close(() => {
    console.log('Server closed.');
  });
});


app.get('/healthz', (req, res) => {
  res.status(200).send('OK');
});

app.use((req, res, next) => {
  const token = req.cookies.access_token

  req.session = { user: null }

  try {
    const data = jwt.verify(token as string, process.env.SECRET_JWT_KEY || "MyBigSecretPassword")
    if (typeof data !== "string") req.session.user = data
  } catch (error) {
    console.error("Error al verificar el token:", error.message);
  }

  next()
})

app.use("/", URLrouter)

app.use("/user", userRouter)

app.listen(PORT, () => {
  console.log(`Port running in http://localhost:${PORT}`)
})