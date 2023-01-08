import express from "express"
import * as OpenApiValidator from 'express-openapi-validator'
import pino from "pino"

import { register } from "./api/card"

require('dotenv').config();

const logger = pino({
  level: process.env.LOG_LEVEL || "info"
})

const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  OpenApiValidator.middleware({
    apiSpec: './schema/openapi.yml',
    validateResponses: process.env.ENABLE_RESPONSE_VALIDATION === "yes",
    validateRequests: true
  }),
);

register(app)

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`server start port:${port}`)
})