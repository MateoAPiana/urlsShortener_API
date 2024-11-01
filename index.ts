import express from "express"
import morgan from "morgan"
import cors from "cors"
import { createNewURLShorted, deleteURL, getAllURLs } from "./models/urls"
import router from "./routes/redirect.routes"
import cookieParser from "cookie-parser"
import jwt from "jsonwebtoken"
import "./types.d"

const app = express()

const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(cookieParser())
app.use(morgan("dev"))

app.use(cors())

app.use("/redirect", router)

app.use((req, res, next) => {
  const token = req.cookies.access_token
  req.session = { user: null }

  try {
    const data = jwt.verify(token, process.env.SECRET_JWT_KEY || "MyBigSecretPassword")
    req.session.user = data
  } catch { }

  next()
})


app.get("/", async (req, res) => {
  const dbRes = await getAllURLs()
  if (dbRes.error) res.status(400).json({ error: dbRes.error })
  res.status(200).json({ urls: dbRes.urls })
})

app.post("/", async (req, res) => {
  const { url } = req.body
  const dbRes = await createNewURLShorted({ url })
  if (dbRes.error) res.status(400).json({ error: dbRes.error })
  else res.status(201).json({ url, newURL: dbRes.newURL })
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