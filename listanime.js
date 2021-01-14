const express = require('express')
const router = express.Router()
const axios = require('axios')
const cheerio = require('cheerio')

const baseUrl = "https://www.animebatch.id/"

router.get("/anime/list/page/:id", async (req, res) => {

    try{
        const pageId = parseInt(req.params.id)
        let url = pageId === 1 ? baseUrl+"batch" : `https://www.animebatch.id/batch/page/${pageId}`
        console.log(url)
        axios.get(url)
        .then(response => {
            const $ = cheerio.load(response.data)
            const content = $("#main")

            let anime_batch = []

            content.find(".blog-post > .pad-blog > article").each((id, el) => {
                let judul = $(el).find(".box-blog > .data > h2 > a").text()
                let link = $(el).find(".box-blog > .data > h2 > a").attr("href").replace(baseUrl,"")
                let created_at = $(el).find(".box-blog > .data > .auth > i").text()
                let img = $(el).find(".box-blog > .img > a").find("img").attr("src")

                anime_batch.push({
                    judul,
                    img,
                    link,
                    created_at
                })
            })

            res.json(anime_batch)
        })
    }catch{

    }
})

router.get("/anime/detail/:link", (req, res) => {
    const slug = req.params.link;
    console.log(slug)
    try{
        axios.get("https://www.animebatch.id/" + slug)
        .then(response => {
            const $ = cheerio.load(response.data)
            const content = $("#main")

            const detail = {}
            let anime_detail = []
            let pertama = []
            let kedua = []
            let ketiga = []

            content.find("article > .player-area").each((id, el) => {
                detail.title = $(el).find("header > .lm > h1").text()
                detail.img = $(el).find("header").find("img").attr("src")
            })

            content.find("article > .anim-senct > .right-senc > .infoanime > .infox > .spe").each((id, el) => {
                $(el).find("b").remove()
                let judul               = $(el).find("span:first-child").text()
                let alternatif_title    = $(el).find("span:nth-child(2)").text()
                let type                = $(el).find("span:nth-child(3)").text()
                let episodes            = $(el).find("span:nth-child(5)").text()
                let musim               = $(el).find("span:nth-child(6)").text()
                let rilis               = $(el).find("span:nth-child(7)").text()
                let studio              = $(el).find("span:nth-child(8)").text()
                let genre               = $(el).find("span:nth-child(10)").text()
                anime_detail.push({
                    judul,
                    alternatif_title,
                    type,
                    episodes,
                    musim,
                    rilis,
                    studio,
                    genre
                }) 

                detail.anime_detail = anime_detail
            })

            content.find("article > .anim-senct > .downman > p").each((id, el) => {
                detail.sinopsis = $(el).text()
                  
            })

            content.find("article > .anim-senct > .whites > .dlx > ul > li:nth-child(1) > a").each((id, el) => {
                let data = []
                let host = $(el).text()
                let downloadlink = $(el).attr("href")
                pertama.push({
                    host,
                    downloadlink
                })
                detail.link_pertama = pertama
            })

            content.find("article > .anim-senct > .whites > .dlx > ul > li:nth-child(2) > a").each((id, el) => {
                let host = $(el).text()
                let downloadlink = $(el).attr("href")
                kedua.push({
                    host,
                    downloadlink
                })
                detail.link_kedua = kedua
            })

            content.find("article > .anim-senct > .whites > .dlx > ul > li:nth-child(3) > a").each((id, el) => {
                let host = $(el).text()
                let downloadlink = $(el).attr("href")
                ketiga.push({
                    host,
                    downloadlink
                })
                detail.link_ketiga = ketiga
            })

            res.json(detail)
        })
    }catch(error){

    }
})

router.get("/anime/genre", (req, res) => {
    try{
        axios.get(baseUrl)
        .then(response => {
            const $ = cheerio.load(response.data)
            const sidebar = $("#sidebar")

            let data = []
            const obj = {}

            sidebar.find(".widgets > ul.genre > li").each((id, el) => {
                $(el).find("a > span").remove()
                let genre_name = $(el).find("a").text()
                let link = $(el).find("a").attr("href").replace(baseUrl+"genre/","")

                data.push({
                    genre_name,
                    link
                })

                obj.genre = data
            })
            

            res.json(obj)
        })
    }catch{

    }
})

module.exports = router