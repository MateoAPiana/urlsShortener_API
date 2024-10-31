import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function createNewURLShorted({ url }) {
  try {
    const id = crypto.randomUUID()
    const newURL = `${process.env.PAGE_URL || "http://localhost:3000"}/redirect/?url=${id}`
    await prisma.uRLRegister.create({
      data: {
        url_original: url,
        url_shorted: id
      }
    })
    return { newURL }
  } catch (error) {
    return { error }
  }
}

export async function getURL({ urlShorted }) {
  try {
    const url = await prisma.uRLRegister.findFirst({ where: { url_shorted: urlShorted } })
    console.log({ url })
    return { url }
  } catch (error) {
    return { error }
  }
}