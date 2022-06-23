

import ejs from "ejs";
import pdf from "html-pdf"
import path from "path";
import puppeteer from "puppeteer";
import express from "express";
import fs from "fs";
import axios from "axios"
const exporter = require('highcharts-export-server');

const app = express();
const port = 3000;

app.use(express.json())


function exportChart() {
    //Export settings
    var exportSettings = {
        type: 'svg',
        options: {
            title: {
                text: 'My Chart'
            },
            xAxis: {
                categories: ["Jan", "Feb", "Mar", "Apr", "Mar", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
            },
            series: [
                {
                    type: 'line',
                    data: [1, 3, 2, 4]
                },
                {
                    type: 'line',
                    data: [5, 3, 4, 2]
                }
            ]
        }
    };

    //Configurar um pool de trabalhadores do PhantomJS
    exporter.initPool();

    //Faça uma exportação
    /*
       As configurações de exportação correspondem aos argumentos CLI disponíveis descritos
        acima de.
    */
    exporter.export(exportSettings, function (err: any, res: any) {
        //O resultado da exportação está agora em res.
        //Se a saída não for PDF ou SVG, ela será codificada em base64 (res.data).
        //Se a saída for um PDF ou SVG, ela conterá um nome de arquivo (res.filename).

        //Mate o pool quando terminarmos com ele e saia do aplicativo
        exporter.killPool();
        process.exit(1);
    });
}

async function postChart() {
    const response = await axios.post('https://export.highcharts.com', {
        infile: {
            chart: {
                type: "column"
            },
            credits: {
                enabled: true,
                text: "appsupply",
                href: "https://painel.appsupply.ml/"
            },
            title: {
                text: "HISTÓRICO DE NOTIFICAÇÕES"
            },
            subtitle: {
                text: "ENVIADAS PARA O USUÁRIO"
            },
            xAxis: {
                categories: ["14/03/2022", "15/03/2022", "16/03/2022", "17/03/2022"]
            },
            yAxis: {
                min: 0,
                title: {
                    text: "Qtd de notificações enviadas"
                }
            },
            tooltip: {
                shared: true,
                footerFormat: "<br/><b>Total:  {point.total} </b>"
            },
            plotOptions: {
                column: {
                    stacking: "number"
                }
            },
            series: [
                {
                    name: "WhatsApp",
                    data: [5, 3, 4, 7]
                },
                {
                    name: "App",
                    data: [5, 5, 4, 3]
                },
                {
                    name: "SMS",
                    data: [2, 2, 3, 2]
                }
            ]
        }
    })
    return response;

}

app.get('/', (request, response) => {
    // exportChart();
    console.log(postChart())
    return response.status(200).send("<img src='' /> ");
    const filePath = path.join(__dirname, "print.html")
    ejs.renderFile(filePath, (err, html) => {
        if (err) {
            return response.send('Erro na leitura do arquivo')
        }
        pdf.create(html, {}).toFile('./temp/pdf/newPdf.pdf', (err, res) => {
            if (err) {
                return response.status(400).send({
                    error: err.message
                });
                return;
            }

            return response.status(200).send(html);
        })
        return;
    })

})

app.get('/pdf', async (request, response) => {

    try {
        const browser = await puppeteer.launch()
        const page = await browser.newPage()

        const dataCreate = new Date()
            .toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
            })
            .replace(/\//g, "_")
            .replace(/:/g, "_")

        await page.goto('http://localhost:3000/', {
            waitUntil: 'networkidle0'
        })
        const pdf = await page.pdf({
            path: path.join(__dirname, `../temp/pdf/${"id_5_" + dataCreate + ".pdf"}`), format: 'a4'
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