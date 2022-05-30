const request = require("request-promise");
const cheerio = require("cheerio");
const express = require("express");
const http = require("http");
const path = require("path");
const mongoose = require("mongoose");
const Publisher = require("./models/Publisher");

const app = express();
const router = express.Router();

const MONGO_URI = "mongodb://holoscrapper:c2MD2N1ivt4cFv6f@holonext-cluster-shard-00-00-8fced.mongodb.net:27017,holonext-cluster-shard-00-01-8fced.mongodb.net:27017,holonext-cluster-shard-00-02-8fced.mongodb.net:27017/Game-Scrapper?ssl=true&replicaSet=holonext-cluster-shard-0&authSource=admin&retryWrites=true&w=majority"
SERVER_PORT = 3000;
var server = require("http").Server(app);

async function handler(req, res) {
  let response;

  try {
    await request(
      req.body.appStoreUrl,
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

async function addStore(req, res) {
  try {
    console.log(req.body)
    //console.log(req)
    const {
      name,
      publisherId,
      appStoreUrl,
      gameList
    } = req.body



    const newPublisher = new Publisher({
      name: name,
      publisherId: publisherId,
      appStoreUrl: appStoreUrl,
      gameList: gameList,
    })

    await newPublisher.save();

    res.json({
      body: { toast: "Creation successfull." },
      error: null,
    });
  } catch (err) {
    console.log(err)
    return res.status(403).json({ body: { toast: "API Not Working. Check Your Paramaters" } });
  }
}

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// parse application/json
app.use(express.json());

app.post("/addStore", addStore)

app.post("/getdata", handler);
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "index.html"));
});
server.listen(SERVER_PORT, () =>
  console.log(`Holonext API listening on port ${SERVER_PORT}!`)
);

// Mongo Connection
mongoose.connect(MONGO_URI, { useNewUrlParser: true }, (err) => {
  if (err) throw err;
  console.log("holonext-db connected.");
});
