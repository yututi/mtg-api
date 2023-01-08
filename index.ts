import express from "express"
const app = express()

app.get("/s/:page", (req, res) => {
  req.query
})


const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`server start port:${port}`)
})