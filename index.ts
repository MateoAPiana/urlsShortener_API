import express from "express"
import morgan from "morgan"
import { createNewURLShorted, deleteURL, getAllURLs } from "./models/urls"
import URLrouter from "./routes/redirect.routes"
import cookieParser from "cookie-parser"
import jwt from "jsonwebtoken"
import userRouter from "./routes/user.routes"
import { corsMiddleware } from "./middleware/cors"
import "./types.d"

const app = express()

const PORT = process.env.PORT || 3000

app.use(corsMiddleware())

app.use(express.json())
app.use(cookieParser())
app.use(morgan("dev"))

app.use("/redirect", URLrouter)

app.use("/user", userRouter)

app.get("/", async (req, res) => {
  const dbRes = await getAllURLs()
  if (dbRes.error) res.status(400).json({ error: dbRes.error })
  res.status(200).json({ urls: dbRes.urls })
})

app.post("/", async (req, res) => {
  const { url, token } = req.body
  req.session = { user: null }

  try {
    const data = jwt.verify(token as string, process.env.SECRET_JWT_KEY || "MyBigSecretPassword")
    if (typeof data !== "string") req.session.user = data
  } catch (error) {
    console.error("Error al verificar el token:", error.message);
  }
  if (req.session?.user === null) res.status(400).json({ error: "Not found user" })
  else {
    const userID = req.session?.user.id
    console.log(userID)
    const dbRes = await createNewURLShorted({ url, userID })
    if (dbRes.error) res.status(400).json({ error: dbRes.error })
    else res.status(201).json({ url, newURL: dbRes.newURL })
  }
})

app.delete("/:url", async (req, res) => {
  const { url } = req.params
  const dbRes = await deleteURL({ url_shorted: url })
  if (dbRes.error) res.status(400).json({ error: dbRes.error })
  else res.status(200).json({ url, newURL: dbRes.dbRes })
})

app.listen(PORT, () => {
  console.log(`Port listening in http://localhost:${PORT}`)
})