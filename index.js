const express = require('express')
const cors = require('cors')
const axios = require('axios')
const cheerio = require('cheerio')
let PORT = process.env.PORT || 3000

const listanime = require("./listanime")

const app = express()

app.use(cors())

app.use("/api", listanime)

app.listen(PORT, () => {
    console.log("Server running")
})
