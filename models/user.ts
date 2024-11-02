import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function createUser(
  { userName, password }:
    { userName: string, password: string }) {
  try {
    console.log({ userName, password })
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