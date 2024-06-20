// 建立路由
const express = require("express");
const router = express.Router();
const request = require("request");
const fs = require("fs");

// 导入数据库
const {
  user_info,
  cycle_info,
  course_scheme,
  monitor_video,
  violate,
  violate_img,
  road,
  webuser,
} = require("../db");
const { Op, where } = require("sequelize");

// 登录账户
router.post("/login", async (req, res) => {
  var account = req.body.account;
  var pswd = req.body.pswd;
  // 检测是否存在该账号
  const account_info = await webuser.findOne({
    attributes: ["user_pswd", "user_cookie"],
    where: {
      user_account: account,
    },
  });
  // 若不存在直接返回异常
  if (account_info == null) {
    res.send({
      status: "账号不存在",
    });
    return;
  }
  // 检测密码与数据库是否匹配
  if (pswd != account_info.user_pswd) {
    res.send({
      status: "密码错误",
    });
    return;
  }
  // 通过验证后，更新随机Cookie
  var randcookie = randomString(32);
  await webuser.update(
    { user_cookie: randcookie },
    {
      where: {
        user_account: account,
      },
    }
  );
  // 设置Cookie
  res.cookie("Cybercycle", randcookie, {
    path: "/",
    signed: "true",
    sameSite: "none",
    secure: "true",
  });
  res.send({
    status: "已登录",
  });
});

// 登出账户
router.post("/logout", async (req, res) => {
  // 根据当前账号重置Cookie信息
  try {
    var cookie = req.signedCookies.Cybercycle;
    var randcookie = randomString(32);
    await webuser.update(
      { user_cookie: randcookie },
      {
        where: {
          user_cookie: cookie,
        },
      }
    );
    // 清除Cookie
    res.clearCookie("Cybercycle");
  } catch {
    res.clearCookie("Cybercycle");
  }
  res.send({
    status: "已退出",
  });
});

// 根据Cookie，获取信息
router.get("/getinfo", async (req, res) => {
  var cookie = req.signedCookies.Cybercycle;
  // 根据cookie查询信息
  const infos = await webuser.findOne({
    attributes: ["user_name", "user_identify"],
    where: { user_cookie: cookie },
  });
  res.send(infos);
});

// 学生信息更新
router.post("/stuinfo/update", async (req, res) => {
  var cookie = req.signedCookies.Cybercycle;
  const infos = await webuser.findOne({
    where: { user_cookie: cookie },
  });
  //验证身份
  if (infos.user_identify != "管理员") {
    res.send({
      status: "身份错误",
    });
    return;
  }
  const stuid = req.body.stuid;
  // 检查是否有注册新车辆
  var cycle_sit = req.body.stu_cycle_sit;
  var old_cycle_sit = await user_info.findOne({
    attributes: ["user_cycle_sit", "user_name"],
    where: {
      user_id: stuid,
    },
  });
  // 如果拥车状态发生变动
  // 注册新车辆
  if (old_cycle_sit.user_cycle_sit == 0 && cycle_sit == 1) {
    var new_id = await randomCycleID();
    await cycle_info.create({
      cycle_id: new_id,
      cycle_user_id: stuid,
      cycle_user_name: req.body.stu_name,
      cycle_lic_num: req.body.stu_cycle_id,
    });
  }
  // 注销旧车辆
  else if (old_cycle_sit.user_cycle_sit == 1 && cycle_sit == 0) {
    await cycle_info.destroy({
      where: {
        cycle_user_id: stuid,
      },
    });
  }
  // 更新拥有车辆
  else if (old_cycle_sit.user_cycle_sit == 1 && cycle_sit == 1) {
    await cycle_info.update(
      {
        cycle_user_id: stuid,
        cycle_user_name: req.body.stu_name,
        cycle_lic_num: req.body.stu_cycle_id,
      },
      {
        where: {
          cycle_user_id: stuid,
        },
      }
    );
  }
  // 更新剩余信息
  await user_info.update(
    {
      user_wxid: req.body.stu_wxid,
      user_name: req.body.stu_name,
      user_academy: req.body.stu_academy,
      user_bedroom: req.body.stu_bedroom,
      user_phone: req.body.stu_phone,
      user_cycle_sit: req.body.stu_cycle_sit,
      user_class_name: req.body.stu_class_name,
      user_credit: req.body.stu_credit,
    },
    {
      where: {
        user_id: stuid,
      },
    }
  );
  res.send({
    status: "更新完成",
  });
});

//
module.exports = router;

// 一个随机生成字符串的方法
function randomString(len) {
  len = len || 32;
  var char = "abacdefghjklmnopqrstuvwxyzABCDEFGHJKLMNOPQRSTUVWXYZ0123456789";
  var charlen = char.length;
  var randS = "";
  for (let i = 0; i < len; i++) {
    randS += char.charAt(Math.floor(Math.random() * charlen));
  }
  return randS;
}

// 一个生成随机车辆ID的方法
async function randomCycleID() {
  for (i = 0; i < 1; i--) {
    // 随机生成数字
    var cycle_id = Math.floor(Math.random() * 1000000);
    const findres = await cycle_info.findOne({
      where: {
        cycle_id: cycle_id,
      },
    });
    // 当不存在冲突则返回随机结果
    if (findres == null) {
      break;
    }
  }
  return cycle_id;
}
