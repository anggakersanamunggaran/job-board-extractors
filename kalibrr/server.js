const express = require('express');


// const runScraper = require('./scrapper');
// const runScraper = require('./jobstreetscrapper');
// const runScraper = require('./gradconnectionscrapper');
// const runReadExcel = require('./excelcheck')
const startScrap = require('./kalibrr-scraper');

const app = express();
const PORT = 8000;


app.listen(PORT, async function onListen() {
  startScrap();
console.log(`Server is up and running on port ${PORT}`);
});