import { Router } from "express"
import { createUser } from "../models/user"

const userRouter = Router()

userRouter.post("/", async (req, res) => {
  try {
    const { userName, password } = req.body
    console.log({ userName, password })
    const dbRes = await createUser({ userName, password })
    if (dbRes?.error) res.status(400).json({ error: dbRes.error })
    else res.status(201).json({ msg: "create" })
  } catch (error) {
    res.status(400).json({ error })
  }
})


export default userRouter