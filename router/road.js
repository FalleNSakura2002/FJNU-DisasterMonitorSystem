// 建立路由
const express = require("express");
const router = express.Router();

// 导入数据库
const {
  user_info,
  cycle_info,
  course_scheme,
  monitor_video,
  violate,
  violate_img,
  road,
} = require("../db");
const { Op, where } = require("sequelize");

// 根据课表与教学班查询交通流
router.get("/TrafficFlow", async (req, res) => {
  // 查询目标房间或目标楼群并重组
  var depart_dormitory = req.query.dormitory + "%";
  var target = req.query.target + "%";
  var time = req.query.time + "%";
  // 查询在目标建筑物进行的课程的教学班
  const course_in_target = await course_scheme.findAll({
    attributes: ["course_class"],
    where: {
      course_loc: {
        [Op.like]: target,
      },
      course_time: {
        [Op.like]: time,
      },
    },
  });
  // 查询对应课程的教学班学生信息，并截取来自目标宿舍的学生
  all_course = [];
  for (i = 0; i < course_in_target.length; i++) {
    all_course.push(course_in_target[i].course_class);
  }
  // 统计人数
  const stu_quantity = await user_info.findAll({
    attributes: ["user_name"],
    where: {
      user_class_name: all_course,
      user_bedroom: {
        [Op.like]: depart_dormitory,
      },
    },
  });
  // 编制返回报文
  res.send({
    dormitory: req.query.dormitory,
    target: req.query.target,
    time: req.query.time,
    quantity: stu_quantity.length,
  });
});

// 查询道路负载
router.get("/Traffic", async (req, res) => {
  // 获取查询目标路段
  var road_id = req.query.road_id;
  // 查询对应路段路况
  const road_traffic = await road.findOne({
    attributes: ["id", "road_name", "traffic"],
    where: {
      id: road_id,
    },
  });
  res.send(road_traffic);
});

//
module.exports = router;
