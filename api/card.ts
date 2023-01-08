import type { Express } from "express"
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const PAGE_SIZE = 20;

type PaginationQuery = {
  name?: string
  color?: string[]
  cost?: string
  types?: string[]
  rarity?: string[]
}

export const register = (app: Express) => {

  app.get("/api/card/page/:page", async (req, res) => {
    const query = req.query as PaginationQuery
    const page = Number(req.params.page)

    const andConditions = []

    const manaCondition: { [key: string]: string } = {}
    if (query.cost) {
      const g = /^(gt|lt|equals):([0-9]*)/.exec(query.cost)
      if (g != null && g.length === 2) {
        const condition = g[0]
        const value = g[1]
        andConditions.push({
          manaValue: {
            [condition]: Number(value)
          }
        })
      }
    }
    if (query.name) {
      andConditions.push({
        name: {
          contains: query.name
        },
      })
    }
    if (query.color && query.color.length > 0) {
      andConditions.push({
        colorIdentities: {
          hasEvery: query.color // TODO 無色の考慮
        }
      })
    }
    if (query.types) {
      andConditions.push(          {
        types: {
          hasEvery: query.types
        }
      })
    }
    if (query.rarity) {
      andConditions.push(          {
        rarity: {
          in: query.rarity
        }
      })
    }

    const count = await prisma.card.count()
    const cards = await prisma.card.findMany({
      skip: page * PAGE_SIZE,
      take: PAGE_SIZE,
      where: {
        AND: andConditions,
      }
    })

    res.json({
      page,
      count,
      list: cards
    })

  })

}