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

// 用户信息相关

// 请求用户名称
router.get("/username", async (req, res) => {
  var wxid = req.headers["x-wx-openid"];
  const username = await user_info.findOne({
    attributes: ["user_name"],
    where: {
      user_wxid: wxid,
    },
  });
  res.send(username);
});

// 绑定微信账号
router.post("/UpdateBind", async (req, res) => {
  var wxid = req.headers["x-wx-openid"];
  var user_id = req.body.stu_id;
  const presen = await user_info.findOne({
    where: {
      user_id: user_id,
    },
  });
  if (presen == null) {
    res.send({
      status: "用户不存在",
    });
  }
  // 更新值
  await user_info.update(
    {
      user_wxid: wxid,
    },
    {
      where: {
        user_id: user_id,
      },
    }
  );
  res.send({
    status: "已绑定",
  });
});

//
module.exports = router;
