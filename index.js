const express = require('express')
const cors = require('cors')
const axios = require('axios')
const cheerio = require('cheerio')

const listanime = require("./listanime")

const app = express()

app.use(cors())

app.use("/api", listanime)

app.listen(8080, () => {
    console.log("Server running")
})