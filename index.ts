import express from "express"
import morgan from "morgan"
import cors from "cors"
import { createNewURLShorted } from "./models/urls"
import router from "./routes/redirect.routes"

const app = express()

const PORT = process.env.PORT || 3000

app.use(express.json())

app.use(morgan("dev"))

app.use(cors())

app.use("/redirect", router)

app.post("/", async (req, res) => {
  const { url } = req.body
  const dbRes = await createNewURLShorted({ url })
  if (dbRes.error) res.status(400).json({ error: dbRes.error })
  else res.status(201).json({ url, newURL: dbRes.newURL })
})

app.listen(PORT, () => {
  console.log(`Port listening in http://localhost:${PORT}`)
})