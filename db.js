const monitor = require("nodemon/lib/monitor");
const { Sequelize, DataTypes } = require("sequelize");
// 云端调试时需要用的配置
// 从环境变量中读取数据库配置
const { MYSQL_USERNAME, MYSQL_PASSWORD, MYSQL_ADDRESS = "" } = process.env;

const [host, port] = MYSQL_ADDRESS.split(":");

const sequelize = new Sequelize("Cybercycle", MYSQL_USERNAME, MYSQL_PASSWORD, {
  host,
  port,
  dialect: "mysql",
  query: { raw: true },
});

// 定义用户信息
const user_info = sequelize.define("user_info", {
  // 记录用户的wxid
  user_wxid: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 0,
  },
  // 记录用户的学号
  user_id: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 0,
    primaryKey: true,
  },
  // 记录用户的名称
  user_name: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "",
  },
  // 记录用户的学院
  user_academy: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "",
  },
  // 记录用户的宿舍
  user_bedroom: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "",
  },
  // 记录用户的手机号
  user_phone: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "",
  },
  // 记录用户是否拥有车辆
  user_cycle_sit: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  // 记录用户的教学班名称
  user_class_name: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "",
  },
  // 记录用户的信用分
  user_credit: {
    type: DataTypes.FLOAT(4, 1),
    allowNull: false,
    defaultValue: "12",
  },
});

// 记录车辆登记信息
const cycle_info = sequelize.define("cycle_info", {
  // 记录电动车备案号
  cycle_id: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "",
    primaryKey: true,
  },
  // 记录所有人学号
  cycle_user_id: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "",
  },
  // 记录所有人姓名
  cycle_user_name: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "",
  },
  // 记录车牌号
  cycle_lic_num: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "",
  },
});

// 记录课表
const course_scheme = sequelize.define("course_scheme", {
  // 教学班名称
  course_class: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: "",
    primaryKey: true,
  },
  // 上课时间
  course_time: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: "未开课",
    primaryKey: true,
  },
  // 课程名称
  course_name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: "课程无名称",
    primaryKey: true,
  },
  // 课程地点
  course_loc: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: "教学地点未安排",
    primaryKey: true,
  },
});

// 记录监控影像
const monitor_video = sequelize.define("monitor_video", {
  // 监控ID
  monitor_id: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "",
    primaryKey: true,
  },
  // 监控路段
  monitor_loc: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "旗山大道",
  },
  // 监控影像路径
  monitor_dir: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "",
  },
});

// 记录违章事件
const violate = sequelize.define("violate", {
  // 违章事件ID
  violate_id: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "",
    primaryKey: true,
  },
  // 违章车辆号牌
  violate_lic_num: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "",
  },
  // 违章地点
  violate_loc: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "",
  },
  // 违章事件上传用户
  violate_judger_wxid: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "",
  },
  // 违章事件评判状态
  violate_res: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  // 违章事件评判人员给出的评判
  violate_judge: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

// 记录违章影像
const violate_img = sequelize.define("violate_img", {
  // 违章事件ID
  violate_id: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "",
    primaryKey: true,
  },
  // 违章影像路径
  violate_img_dir: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "",
  },
});

// 记录web端登录信息
const webuser = sequelize.define("webuser", {
  // 用户名称
  user_name: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "",
  },
  // 用户身份
  user_identify: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "",
  },
  // 用户账号
  user_account: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "",
  },
  // 用户密码
  user_pswd: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "",
  },
  // 用户当前cookie
  user_cookie: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "",
  },
});

// 记录道路数据
const road = sequelize.define("road");

// 数据库初始化方法
async function init() {
  await user_info.sync({ alter: true });
  await cycle_info.sync({ alter: true });
  await course_scheme.sync({ alter: true });
  await monitor_video.sync({ alter: true });
  await violate.sync({ alter: true });
  await violate_img.sync({ alter: true });
  await webuser.sync({ alter: true });
}

// 导出初始化方法和模型
module.exports = {
  init,
  user_info,
  cycle_info,
  course_scheme,
  monitor_video,
  violate,
  violate_img,
  road,
  webuser,
};
