import { Router } from "express"
import { createUser, loginUser } from "../models/user"
import jwt from "jsonwebtoken"

const userRouter = Router()

userRouter.post("/", async (req, res) => {
  try {
    const { userName, password } = req.body
    const dbRes = await createUser({ userName, password })
    if (dbRes?.error) res.status(400).json({ error: dbRes.error })
    else {
      const token = jwt.sign({ username: userName },
        process.env.SECRET_JWT_KEY || "MyBigSecretPassword",
        {
          expiresIn: '10h'
        })
      res
        .cookie('access_token', token, {
          sameSite: 'lax',
          maxAge: 1000 * 60 * 60
        })
        .send({ user: { userName, password } })
      res.status(201).json({ msg: "create" })
    }
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
          expiresIn: '10h'
        })
      res
        .cookie('access_token', token, {
          sameSite: 'lax',
          maxAge: 1000 * 60 * 60
        })
        .send({ user })
    }
  } catch (error) {
    res.status(401).send(error.message)
  }
})


export default userRouter