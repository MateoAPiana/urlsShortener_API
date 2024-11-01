import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function getAllURLs() {
  try {
    const dbRes = await prisma.uRLRegister.findMany({ select: { url_original: true, url_shorted: true } })
    return dbRes ? { urls: dbRes } : { error: "not found urls" }
  } catch (error) {
    return { error }
  }
}

export async function createNewURLShorted({ url }) {
  try {
    const id = crypto.randomUUID()
    const newURL = `${process.env.PAGE_URL || "http://localhost:3000"}/redirect/${id}`
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

export async function deleteURL({ url_shorted }) {
  try {
    const res = await prisma.uRLRegister.findFirst({ where: { url_shorted }, select: { id: true } })
    if (!res) return { error: "not found" }
    const dbRes = await prisma.uRLRegister.delete({ where: { id: res.id } })
    return { dbRes }
  } catch (error) {
    return { error }
  }
}