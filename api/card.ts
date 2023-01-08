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
  setCode?: string[]
}

export const register = (app: Express) => {

  app.get("/api/card/page/:page", async (req, res) => {
    const query = req.query as PaginationQuery
    const page = Number(req.params.page)

    const andConditions = []

    if (query.cost) {
      const g = /^(gte|lte|equals):([0-9]*)/.exec(query.cost)
      if (g != null && g.length > 2) {
        const condition = g[1]
        const value = g[2]
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
      andConditions.push({
        types: {
          hasEvery: query.types
        }
      })
    }
    if (query.rarity) {
      andConditions.push({
        rarity: {
          in: query.rarity
        }
      })
    }
    if (query.setCode) {
      andConditions.push({
        setCode: {
          in: query.setCode
        }
      })
    }

    const count = await prisma.card.count({
      where: {
        AND: andConditions,
      }
    })
    const cards = await prisma.card.findMany({
      skip: page * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        uuid: true,
        name: true,
        setCode: true,
        rarity: true,
        manaCost: true,
        otherFaceUuid: true
      },
      where: {
        AND: andConditions,
      }
    })

    res.json({
      page,
      pageSize: PAGE_SIZE,
      count,
      list: cards
    })

  })


  app.get("/api/card/detail/:uuid", async (req, res) => {
    const card = await prisma.card.findUnique({
      select: {
        uuid: true,
        name: true,
        setCode: true,
        rarity: true,
        manaCost: true,
        otherFaceUuid: true,
        power: true,
        toughness: true,
        text: true,
        flavorText: true,
        loyalty: true,
        types: true,
        subTypes: true,
        superTypes: true
      },
      where: {
        uuid: req.params.uuid
      }
    })

    if (card) {
      return res.json(card)
    }
    res.status(404).send()
  })
}