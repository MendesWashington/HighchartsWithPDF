

import ejs from "ejs";
import pdf from "html-pdf"
import path from "path";
import puppeteer from "puppeteer";
import express from "express";
const exporter = require('highcharts-export-server');

const app = express();
const port = 3000;

app.use(express.json())

app.get('/', (request, response) => {
    var exportSettings = {
        type: 'png',
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

    //Set up a pool of PhantomJS workers
    exporter.initPool();

    //Perform an export
    /*
        Export settings corresponds to the available CLI arguments described
        above.
    */
    exporter.export(exportSettings, function (err: any, res: any) {
        if (err) {
            console.log(err)
        }
        console.log(res)

        exporter.killPool();
        process.exit(1);
    });
    /*   const filePath = path.join(__dirname, "print.ejs")
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
   */
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