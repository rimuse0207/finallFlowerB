var express = require("express");
var router = express.Router();
const request = require("request");
const parser = require("xml2json");

const HOST = "http://api.nongsaro.go.kr/service/garden/gardenList";
const requestUrl = `${HOST}?apiKey=20200206NNRF9K4P2NRBPWZJ2RC8GW&&numOfRows=127`;
const HOST2 = "http://api.nongsaro.go.kr/service/garden/gardenDtl";
const requestUrl2 = `${HOST2}?apiKey=${process.env.APIKEY}&&cntntsNo=`;
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
  res.json({ data: data });
});

router.post("/qwe", async (req, res) => {
  try {
    let data3 = null;
    let number = req.body.number;
    console.log(number);
    await request(
      {
        url: `${requestUrl2}${req.body.number}`,
        method: "GET",
      },
      (error, response, xml) => {
        const json = JSON.parse(parser.toJson(xml));
        data3 = json.response.body.item;
        console.log(data3);
        res.json(data3);
      }
    );
  } catch (err) {
    console.log("Detail error ", err);
  }
});
module.exports = router;
