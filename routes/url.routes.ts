import { Router } from "express"
import { createNewURLShorted, deleteURL, getURL, getURLByUser, incrementCounterVisited } from "../models/urls"
import "../types.d"

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

URLrouter.get("/url/read", async (req, res) => {
  if (req.session?.user === null) res.status(400).json({ error: "Not found user" })
  else {
    const userID = req.session?.user.id
    const dbRes = await getURLByUser({ userID })
    if (typeof dbRes !== "object") res.status(400).json({ error: dbRes })
    else res.status(200).json({ urls: dbRes })
  }
})

URLrouter.post("/url/read", async (req, res) => {
  if (req.session?.user === null) res.status(400).json({ error: "Not found user" })
  else {
    const userID = req.session?.user.id
    const dbRes = await getURLByUser({ userID })
    if (typeof dbRes !== "object") res.status(400).json({ error: dbRes })
    else res.status(200).json({ urls: dbRes })
  }
})

URLrouter.post("/url/create", async (req, res) => {
  const { url } = req.body
  if (req.session?.user === null) res.status(400).json({ error: "Not found user" })
  else {
    const userID = req.session?.user.id
    const dbRes = await createNewURLShorted({ url, userID })
    if (dbRes.error) res.status(400).json({ error: dbRes.error })
    else res.status(201).json({ url, newURL: dbRes.newURL })
  }
})

URLrouter.delete("/:url", async (req, res) => {
  if (req.session?.user === null) res.status(400).json({ error: "Not found user" })
  const { url } = req.params
  const dbRes = await deleteURL({ url_shorted: url })
  if (dbRes.error) res.status(400).json({ error: dbRes.error })
  else res.status(200).json({ url, newURL: dbRes.dbRes })
})

export default URLrouter