const request = require("request-promise");
const cheerio = require("cheerio");
const express = require("express");
const http = require("http");
const path = require("path");

const app = express();
const router = express.Router();

SERVER_PORT = 3000;
var server = require("http").Server(app);

async function handler(req, res) {
  let response;

  try {
    await request(
      "https://apps.apple.com/us/developer/toprak-yildirim/id1598138404?see-all=i-phonei-pad-apps",
      (error, response, html) => {
        if (!error && response.statusCode == 200) {
          const htmlOutput = cheerio.load(html);
          const dataMain = htmlOutput(".l-row l-row--peek");
          const index = dataMain.find("a").text();
          let array = [];
          htmlOutput(".l-row").each((i, data) => {
            for (let j = 0; j < htmlOutput(data).children().length; j++) {
              array.push(htmlOutput(data).children()[j].attribs.href);
            }
          });
          res.status(201).send(JSON.stringify(array));
          console.log(array);
        }
      }
    );
  } catch (err) {
    res.status(500).send();
  }
}

app.get("/getdata", handler);
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "index.html"));
});
server.listen(SERVER_PORT, () =>
  console.log(`Holonext API listening on port ${SERVER_PORT}!`)
);
