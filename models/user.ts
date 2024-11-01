import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function Register(
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