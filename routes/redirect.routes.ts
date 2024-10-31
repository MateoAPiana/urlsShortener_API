import { Router } from "express"
import { getURL } from "../models/urls"

const router = Router()

router.get("/:url", async (req, res) => {
  const { url } = req.params
  console.log(url)
  const dbRes = await getURL({ urlShorted: url })
  if (dbRes.error || dbRes.url?.url_original === undefined) res.status(400).json({ error: dbRes.error })
  else res.status(200).redirect(dbRes.url?.url_original)
})

export default router