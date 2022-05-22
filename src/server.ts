

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
            printBackground: true,
            format: 'Letter'
        })

        await browser.close()

        response.contentType("application/pdf")

        return response.send(pdf)

        // Create the chart    
        /*  Highcharts.chart({
             chart: {
                 type: 'column'
             },
             title: {
                 text: 'HISTÓRICO DE NOTIFICAÇÕES'
             },
             subtitle: {
                 text: 'ENVIADAS PARA O USUÁRIO'
             },
             xAxis: {
                 categories: ['14/03/2022', '15/03/2022', '16/03/2022', '17/03/2022']
             },
             yAxis: {
                 min: 0,
                 title: {
                     text: 'Qtd de notificações enviadas'
                 }
             },
             tooltip: {
                 pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
                 shared: true,
                 footerFormat: '<br/><b>Total:  {point.total} </b>'
             },
             plotOptions: {
                 column: {
                     stacking: 'number'
                 }
             },
             series: [{
                 name: 'WhatsApp',
                 data: [5, 3, 4, 7]
             }, {
                 name: 'App',
                 data: [5, 5, 4, 3]
             },
             {
                 name: 'SMS',
                 data: [2, 2, 3, 2]
             }]
         }); */
        return response.send("Finish")
    } catch (error) {

    }

})

app.listen(port, () => {
    console.log(`http://localhost:${port}`)
})