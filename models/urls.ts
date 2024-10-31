import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export function createNewURLShorted({ url }) {
  try {
    const id = crypto.randomUUID()
    const newURL = `${process.env.PAGE_URL}/${id}`
    prisma.uRLRegister.create({
      data: {
        url_original: url,
        url_shorted: newURL
      }
    })
    return { newURL }
  } catch (error) {
    return { error }
  }
}