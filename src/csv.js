// 引入转换库
const iconv = require("iconv-lite");
const csv = require("csvtojson");
const res = require("express/lib/response");
const { Association, Sequelize } = require("sequelize");
const {
  init: initDB,
  user_info,
  cycle_info,
  course_scheme,
  monitor_video,
  violate,
  violate_img,
} = require("../db");

function usertojs(csv_file) {
  var result = "";
  // 转换csv
  const converter = csv()
    .fromFile(csv_file, { encoding: "binary" })
    .then((json) => {
      //binary和fromFile中的文件读取方式要一致
      var buf = new Buffer(JSON.stringify(json), "binary"); //第一个参数格式是字符串
      var str = iconv.decode(buf, "GBK"); //原文编码我这是GBK
      str = JSON.parse(JSON.stringify(str)); //解码后为字符串，需要先转成json字符串
      var data = eval(str);
      return data;
    })
    .then((data) => {
      // 读取json
      for (let i = 0; i < data.length; i++) {
        if (data[i].是否有车 == "有") {
          usercycle_sit = 1;
        } else {
          usercycle_sit = 0;
        }
        user_info.create({
          user_wxid: "wx_" + String(i),
          user_id: data[i].学号,
          user_name: data[i].姓名,
          user_academy: data[i].学院,
          user_bedroom:
            data[i].楼群 + String(data[i].楼号) + "_" + data[i].宿舍号,
          user_phone: data[i].手机号,
          user_cycle_sit: usercycle_sit,
          user_class_name: data[i].教学班,
          user_credit: 12,
        });
      }
    });
  return result;
}

function coursetojs(csv_file) {
  var result = "";
  // 转换csv
  const converter = csv()
    .fromFile(csv_file, { encoding: "binary" })
    .then((json) => {
      //binary和fromFile中的文件读取方式要一致
      var buf = new Buffer(JSON.stringify(json), "binary"); //第一个参数格式是字符串
      var str = iconv.decode(buf, "GBK"); //原文编码我这是GBK
      str = JSON.parse(JSON.stringify(str)); //解码后为字符串，需要先转成json字符串
      var data = eval(str);
      return data;
    })
    .then((data) => {
      // 建立循环头
      samenum = 0;
      week = ["星期一", "星期二", "星期三", "星期四", "星期五"];
      times = ["1-2", "3-4", "5-6", "7-8"];
      header = ["教学班", "学院"];
      for (day in week) {
        day = week[day];
        for (time in times) {
          time = times[time];
          coursetime = String(day) + "第" + String(time) + "节";
          header.push(coursetime);
          header.push("教学地点" + String(samenum));
          samenum += 1;
        }
      }
      // 循环文件
      for (let i = 0; i < data.length; i++) {
        sinclass = data[i];
        classacademy = sinclass.学院;
        classname = sinclass.教学班;
        for (let j = 2; j < header.length; j = j + 2) {
          if (sinclass[header[j]] != "") {
            coursename = sinclass[header[j]];
            let loc = j + 1;
            loc = sinclass[header[loc]];
            course_scheme.create({
              course_class: classname,
              course_time: header[j],
              course_name: coursename,
              course_loc: loc,
            });
          }
        }
      }
    });
  return result;
}

async function cycletojs() {
  const userdata = await user_info.findAll({
    raw: true,
    attributes: ["user_id", "user_name"],
    where: {
      user_cycle_sit: true,
    },
  });
  id = 0;
  randstr = ["A", "B", "C", "D"];
  exist_num = [];
  for (let i = 0; i < userdata.length; i++) {
    for (let j = 0; j < 2; j++) {
      cycle_lic = Math.floor(Math.random() * 10000);
      if (cycle_lic in exist_num) {
        continue;
      } else {
        exist_num.push(cycle_lic);
        break;
      }
    }
    cycle_lic = String(cycle_lic);
    if (cycle_lic.length < 4) {
      for (let i = 0; (i = 4 - cycle_lic.length); i++) {
        cycle_lic = "0" + String(cycle_lic);
      }
    } else {
      cycle_lic = String(cycle_lic);
    }
    cycle_lic = randstr[Math.floor(Math.random() * 4)] + cycle_lic;
    cycle_info.create({
      cycle_id: id,
      cycle_user_id: userdata[i].user_id,
      cycle_user_name: userdata[i].user_name,
      cycle_lic_num: cycle_lic,
    });
    id += 1;
  }
  return userdata;
}

module.exports = {
  usertojs,
  coursetojs,
  cycletojs,
};
