import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function createUser(
  { userName, password }:
    { userName: string, password: string }) {
  try {
    await prisma.user.create({
      data: {
        userName,
        password
      }
    })
  } catch (error) {
    return { error }
  }
}

export async function loginUser({ userName, password }) {
  try {
    const user = await prisma.user.findUniqueOrThrow({ where: { userName, password } })
    return user
  } catch (error) {
    console.log(error)
  }
}