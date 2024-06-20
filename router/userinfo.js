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
} = require("../db");
const { Op } = require("sequelize");

// 用户信息相关

// 根据学号请求用户信息
router.get("/", async (req, res) => {
  // 初始化信息
  var userinfo = "";
  // 判断输入参数是什么，分别进行不同处理
  if (req.query.user_id == null) {
    var wxid = req.headers["x-wx-openid"];
    // 如果没有输入任何参数,直接返回
    if (wxid == null) {
      res.send({
        status: "未输入凭据",
      });
      return;
    }
    userinfo = await user_info.findOne({
      attributes: { exclude: ["createdAt", "updatedAt"] },
      where: {
        user_wxid: wxid,
      },
    });
    // 账号不存在直接返回
    if (userinfo == null) {
      res.send({
        status: "账号未绑定",
      });
      return;
    }
  } else {
    var user_id = req.query.user_id;
    // 根据学号,请求信息
    userinfo = await user_info.findOne({
      attributes: { exclude: ["createdAt", "updatedAt"] },
      where: {
        user_id: user_id,
      },
    });
    // 账号不存在直接返回
    if (userinfo == null) {
      res.send({
        status: "账号不存在",
      });
      return;
    }
  }
  var user_id = userinfo.user_id;
  if (userinfo.user_cycle_sit == 1) {
    // 根据学号查询车辆信息
    const cycleinfos = await cycle_info.findOne({
      attributes: ["cycle_lic_num"],
      where: {
        cycle_user_id: user_id,
      },
    });
    userinfo.user_lic_num = cycleinfos.cycle_lic_num;
  } else {
    userinfo.user_lic_num = "";
  }
  userinfo.status = "账号存在";
  res.send(userinfo);
});

// 请求用户名下车辆信息
router.get("/license", async (req, res) => {
  var wxid = req.headers["x-wx-openid"];
  // 根据openid,请求学号
  const userinfo = await user_info.findOne({
    attributes: ["user_id"],
    where: {
      user_wxid: wxid,
    },
  });
  var userid = userinfo.user_id;

  // 根据学号查询车辆信息
  const cycleinfos = await cycle_info.findAll({
    attributes: { exclude: ["createdAt", "updatedAt"] },
    where: {
      cycle_user_id: userid,
    },
  });
  res.send(cycleinfos);
});

// 查询用户违章信息
router.get("/violate", async (req, res) => {
  var wxid = req.headers["x-wx-openid"];
  // 根据openid,请求学号
  const userinfo = await user_info.findOne({
    attributes: ["user_id"],
    where: {
      user_wxid: wxid,
    },
  });
  var userid = userinfo.user_id;
  // 根据学号查询车辆信息
  const cycleinfos = await cycle_info.findAll({
    attributes: ["cycle_lic_num"],
    where: {
      cycle_user_id: userid,
    },
  });

  // 根据车牌号查询
  var user_license = [];
  // 将用户车辆车牌重组为数组
  for (let i = 0; i < cycleinfos.length; i++) {
    user_license.push(cycleinfos[i].cycle_lic_num);
  }

  // 利用车牌数组查询违章事件
  const violate_events = await violate.findAll({
    attributes: ["violate_id", "violate_loc", "violate_lic_num"],
    where: {
      violate_lic_num: {
        [Op.or]: user_license,
      },
    },
  });
  res.send(violate_events);
});

// 查询用户课表
router.get("/scheme", async (req, res) => {
  var wxid = req.headers["x-wx-openid"];
  // 根据openid,请求教学班名称
  const userinfo = await user_info.findOne({
    attributes: ["user_class_name"],
    where: {
      user_wxid: wxid,
    },
  });
  var userClassname = userinfo.user_class_name;
  // 根据教学班名称查询课表
  const scheme = await course_scheme.findAll({
    attributes: { exclude: ["createdAt", "updatedAt", "course_class"] },
    where: {
      course_class: userClassname,
    },
  });
  res.send(scheme);
});

//
module.exports = router;
