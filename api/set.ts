import type { Express } from "express"
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const registerSetAPI = (app: Express) => {

  app.get("/api/set", async (req, res) => {

    const set = await prisma.set.findMany({})

    res.json(set)
  })

}