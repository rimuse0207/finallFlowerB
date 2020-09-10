var express = require("express");
const crypto = require("crypto");
var router = express.Router();
const request = require("request");
const parser = require("xml2json");

const User = require("../mongoose/User/user");

const HOST = "http://api.nongsaro.go.kr/service/garden/gardenList";
const requestUrl = `${HOST}?apiKey=20200206NNRF9K4P2NRBPWZJ2RC8GW&&numOfRows=127`;
const HOST2 = "http://api.nongsaro.go.kr/service/garden/gardenDtl";
const requestUrl2 = `${HOST2}?apiKey=20200206NNRF9K4P2NRBPWZJ2RC8GW&&numOfRows=127&&cntntsNo=`;
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
router.get(`/qwe`, (req, res) => {
  res.json({ data: data3 });
});

router.post("/login", async (req, res, next) => {
  try {
    var cipher = crypto.createCipher("aes192", "나만아는 비밀번호");
    cipher.update(req.body.password, "utf8", "base64");
    var cipheredOutput = cipher.final("base64");
    const users = await User.find({
      email: req.body.email,
      password: cipheredOutput,
    });

    if (!Object.keys(users).length) {
      res.send({ emailCheck: false, passwordCheck: false });
    } else {
      res.send({
        emailCheck: true,
        passwordCheck: true,
        loginSuccess: true,
        useredName: req.body.email,
      });
    }
  } catch (e) {
    console.error(error);
    next(error);
  }
});

router.post("/signUp", async (req, res, next) => {
  console.log("singup Test");
  try {
    console.log(req.body);
    const users = await User.find({
      email: req.body.email,
    });
    console.log(Object.keys(users).length);
    console.log(!Object.keys(users).length);
    if (!Object.keys(users).length) {
      var cipher = crypto.createCipher("aes192", "나만아는 비밀번호");
      cipher.update(req.body.password, "utf8", "base64");
      var cipheredOutput = cipher.final("base64");
      console.log(cipheredOutput);
      const usersAdd = await User({
        email: req.body.email,
        password: cipheredOutput,
      });

      console.log(usersAdd);
      console.log("sign success");
      usersAdd.save();
      res.send({ signUp: true, emailOverlap: true });
    } else {
      console.log("email overlap");
      res.send({ emailOverlap: false });
    }
  } catch (e) {
    console.log("error");
    console.error(error);
    next(error);
  }
});

router.post("/qqq", (req, res, next) => {
  User.find({ email: "qwe" })
    .then((users) => {
      res.json(users);
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
});

module.exports = router;
