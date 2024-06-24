// 建立路由
const express = require("express");
const router = express.Router();

// 导入数据库
const { DisasterInfo } = require("../db");
const { Op, where } = require("sequelize");

// 获取所有事件
router.get("/infoDetail", async (req, res) => {
  const Allinfo = await DisasterInfo.findAll({
    attributes: { exclude: ["id"] },
  });
  res.send(Allinfo);
});

// 获取区域内事件
router.get("/regionInfo", async (req, res) => {
  const region = req.query.region;
  const region_type = req.query.region_type;
  const startTime = req.query.startTime;
  const endTime = req.query.endTime;
  // 按省查询区域
  var regionInfo = "";
  if (region_type == "省") {
    regionInfo = await DisasterInfo.findAll({
      attributes: { exclude: ["id"] },
      where: {
        province: region,
      },
    });
    // 按市查询区域
  } else {
    regionInfo = await DisasterInfo.findAll({
      attributes: { exclude: ["id"] },
      where: {
        city: region,
      },
    });
  }
  res.send(regionInfo);
});

// 按照条件获取事件
router.get("/infoFilter", async (req, res) => {
  const region = req.query.region;
  const region_type = req.query.region_type;
  const startTime = req.query.startTime;
  const endTime = req.query.endTime;

  if (endTime == "") {
    endTime = new Date();
  }
  // 按省查询区域
  var regionInfo = "";
  if (region_type == "省") {
    regionInfo = await DisasterInfo.findAll({
      attributes: { exclude: ["id"] },
      where: {
        province: region,
      },
    });
    // 按市查询区域
  } else {
    regionInfo = await DisasterInfo.findAll({
      attributes: { exclude: ["id"] },
      where: {
        city: region,
      },
    });
  }
  res.send(regionInfo);
});

// 上传事件
router.post("/createInfo", async (req, res) => {
  const province = req.body.province;
  const city = req.body.city;
  const address = req.body.address;
  const coordinate = req.body.coordinate;
  const occurrenceTime = req.body.occurrenceTime;
  const validation = req.body.validation;

  await DisasterInfo.create({
    province: province,
    city: city,
    address: address,
    coordinate: coordinate,
    occurrenceTime: occurrenceTime,
    validation: validation,
  });

  res.send({
    status: "ok",
  });
});

//
module.exports = router;
