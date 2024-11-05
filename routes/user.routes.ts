import { Router } from "express"
import { createUser, loginUser } from "../models/user"
import jwt from "jsonwebtoken"

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

userRouter.post("/login", async (req, res) => {
  const { userName, password } = req.body
  try {
    const user = await loginUser({ userName, password })
    if (!user) res.status(401).json({ error: "Not found user" })
    else {
      const token = jwt.sign({ id: user.id, username: user.userName },
        process.env.SECRET_JWT_KEY || "MyBigSecretPassword",
        {
          expiresIn: '1h'
        })
      res
        .cookie('access_token', token, {
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 1000 * 60 * 60,
        })
        .send({ user })
    }
  } catch (error) {
    res.status(401).send(error.message)
  }
})


export default userRouter