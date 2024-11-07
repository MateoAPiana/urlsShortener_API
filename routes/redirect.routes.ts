import { Router } from "express"
import { getURL, incrementCounterVisited } from "../models/urls"

const URLrouter = Router()

URLrouter.get("/:url", async (req, res) => {
  const { url } = req.params
  try {
    const incrementRes = await incrementCounterVisited(url)
    if (incrementRes === undefined) res.status(400).json({ error: "Error increment visited" })
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: "Error increment visited" })
  }
  const dbRes = await getURL({ urlShorted: url })
  if (dbRes.error || dbRes.url?.url_original === undefined) res.status(400).json({ error: dbRes.error })
  else res.status(200).redirect(dbRes.url?.url_original)
})

export default URLrouter