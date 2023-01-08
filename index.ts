import express from "express"
import * as OpenApiValidator from 'express-openapi-validator'

import { register } from "./api/card"

const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(
//   OpenApiValidator.middleware({
//     apiSpec: './schema/openapi.yml',
//     validateResponses: true,
//     validateRequests: true
//   }),
// );

register(app)

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`server start port:${port}`)
})