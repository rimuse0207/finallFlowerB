var express = require("express");
var router = express.Router();
const request = require("request");
const parser = require("xml2json");

const HOST = "http://api.nongsaro.go.kr/service/garden/gardenList";
const requestUrl = `${HOST}?apiKey=20200206NNRF9K4P2NRBPWZJ2RC8GW&&numOfRows=10`;
let data = null;
const datas = request(
  {
    url: requestUrl,
    method: "GET",
  },
  (error, response, xml) => {
    const json = JSON.parse(parser.toJson(xml));
    data = json.response.body.items.item;
    console.log(requestUrl);
  }
);

/* GET users listing. */
router.get("/", (req, res) => {
  // res.header("Access-Control-Allow-Origin", "*");
  // res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
  // res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
  // res.header("Access-Control-Allow-Credentials", true);
  console.log(data);

  res.json({ data: data });
});

module.exports = router;
