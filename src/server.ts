

import ejs from "ejs";
import path from "path";
import puppeteer from "puppeteer";
import express from "express";
import Highcharts from "highcharts";

const app = express();
const port = 3000;

app.use(express.json())

app.get('/', (request, response) => {

    const filePath = path.join(__dirname, "print.ejs")
    ejs.renderFile(filePath, (err, html) => {
        if (err) {
            return response.send('Erro na leitura do arquivo')
        }

        // enviar para o navegador
        return response.send(html)
    })

})
app.get('/pdf', async (request, response) => {

    try {
        const browser = await puppeteer.launch()
        const page = await browser.newPage()

        await page.goto('http://localhost:3000/', {
            waitUntil: 'networkidle0'
        })
        const pdf = await page.pdf({
            path: path.join(__dirname, `../temp/pdf/${"id_5_30_05_2022_22" + ".pdf"}`), format: 'a4'
        })

        await browser.close()

        response.contentType("application/pdf")

        return response.send(pdf)
    } catch (error) {

    }

})

app.listen(port, () => {
    console.log(`http://localhost:${port}`)
})