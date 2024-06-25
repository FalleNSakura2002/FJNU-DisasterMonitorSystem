// 建立路由
const express = require("express");
const router = express.Router();

// 导入数据库
const { DisasterInfo } = require("../db");
const { Op, where } = require("sequelize");

// 获取所有事件
router.get("/allInfoDetail", async (req, res) => {
  const Allinfo = await DisasterInfo.findAll({});
  res.send(Allinfo);
});

// 上传事件
router.post("/createInfo", async (req, res) => {
  const province = req.body.province;
  const city = req.body.city;
  const address = req.body.address;
  const coordinate = req.body.coordinate;
  const occurrenceTime = req.body.occurrenceTime;
  const validation = req.body.validation;
  const detail = req.body.detail;
  const mediaUrl = req.body.mediaUrl;

  await DisasterInfo.create({
    province: province,
    city: city,
    address: address,
    coordinate: coordinate,
    occurrenceTime: occurrenceTime,
    validation: validation,
    detail: detail,
    mediaUrl: mediaUrl,
  });

  res.send({
    status: "OK",
  });
});

//
module.exports = router;
