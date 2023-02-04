import express from "express"
import { middleware } from 'express-openapi-validator'
import pino from "pino"
import cors from "cors"

import { registerCardAPI } from "./api/card"
import { registerSetAPI } from "./api/set"

require('dotenv').config();

const logger = pino({
  level: process.env.LOG_LEVEL || "info"
})

const app = express()
app.use(cors({
  origin: process.env.FRONTEND_HOST || ""
}))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  middleware({
    apiSpec: './schema/openapi.yml',
    validateResponses: process.env.ENABLE_RESPONSE_VALIDATION === "yes",
    validateRequests: true
  }),
);

registerCardAPI(app)
registerSetAPI(app)

app.get("/health", (req, res) => {
  res.json({ status: "ok" })
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`server start port:${port}`)
})