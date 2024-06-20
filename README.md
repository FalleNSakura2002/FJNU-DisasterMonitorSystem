# 赛博风水师“单车猎人”后端项目

[![GitHub license](https://img.shields.io/github/license/WeixinCloud/wxcloudrun-express)](https://github.com/WeixinCloud/wxcloudrun-express)
![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/WeixinCloud/wxcloudrun-express/express)
![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/WeixinCloud/wxcloudrun-express/sequelize)
![GitHub package.json dependency version (prod)](https://img.shields.io/badge/ejs-%5E3.1.8-blue)
![GitHub package.json dependency version (prod)](https://img.shields.io/badge/cookie--parser-%5E1.4.6-blue)

本项目基于微信云托管 Node.js Express 框架模版二次修改。

## 项目结构说明

```
.
├── Dockerfile
├── README.md
├── container.config.json
├── db.js
├── index.js
├── index.html
├── package.json
```

- `index.js`：项目入口
- `db.js`：数据库相关实现，使用 `sequelize` 作为 ORM
- `index.html`：首页代码
- `store_login.html`：登录页面代码
- `store_register.html`：注册页面代码
- `store_register_err.ejs`：页面报错渲染模板
- `store_register_ok.ejs`：注册成功渲染模板
- `store_main.ejs`：后台管理页面渲染模板
- `package.json`：Node.js 项目定义文件
- `container.config.json`：模板部署「服务设置」初始化配置
- `Dockerfile`：容器配置文件

## 用户信息 API 接口

### 请求用户信息 `GET /userinfo`

#### 请求参数

以下参数任选一，且`user_id`具有更高优先级

- `x-wx-openid`: 微信 openID
- `user_id`: 查询对象的学号

#### 响应结果

- `user_wxid`: 用户微信 openID
- `user_id`: 用户学号
- `user_name`: 用户姓名
- `user_academy`: 用户所属学院
- `user_bedroom`: 用户宿舍
- `user_phone`: 用户手机号
- `user_cycle_sit`: 用户拥车情况(`1`为拥有, `0`为不拥有)
- `user_class_name`: 用户所属教学班
- `user_credit`: 用户信用分
- `user_lic_num`: 返回车牌号
- `status`: 用户信息,分为`账号存在`、`账号不存在`、`账号未绑定`与`未输入凭据`

#### 响应结果示例

```json
{
  "user_wxid": "wx_16323",
  "user_id": "100002019011",
  "user_name": "柴文",
  "user_academy": "心理学院",
  "user_bedroom": "桂苑10_301",
  "user_phone": "13379046420",
  "user_cycle_sit": 1,
  "user_class_name": "2022级心理学类1班",
  "user_credit": 12,
  "user_lic_num": "B4755",
  "status": "账号存在"
}
```

### 请求用户拥有的所有车辆信息 `GET /userinfo/license`

#### 请求参数

- `x-wx-openid`: 微信 openID

#### 响应结果

- `cycle_id`: 用户车辆 ID
- `cycle_user_id`: 用户学号
- `cycle_user_name`: 用户姓名
- `cycle_lic_num`: 车辆车牌号

#### 响应结果示例

```json
[
  {
    "cycle_id": "0",
    "cycle_user_id": "100002019011",
    "cycle_user_name": "柴文",
    "cycle_lic_num": "B4755"
  },
  {
    "cycle_id": "100012",
    "cycle_user_id": "100002019011",
    "cycle_user_name": "柴文",
    "cycle_lic_num": "C2312"
  }
]
```

### 请求用户所有的违章信息 `GET /userinfo/violate`

#### 请求参数

- `x-wx-openid`: 微信 openID

#### 响应结果

- `violate_id`: 违章事件 ID
- `violate_loc`: 违章地点
- `violate_lic_num`: 违章车辆车牌号

#### 响应结果示例

```json
[
  {
    "violate_id": "1",
    "violate_loc": "嘉树园",
    "violate_lic_num": "B4755"
  },
  {
    "violate_id": "2",
    "violate_loc": "桃李园",
    "violate_lic_num": "B4755"
  },
  {
    "violate_id": "3",
    "violate_loc": "桃李园",
    "violate_lic_num": "C2312"
  }
]
```

### 请求用户的课程信息 `GET /userinfo/scheme`

#### 请求参数

- `x-wx-openid`: 微信 openID

#### 响应结果

- `course_time`: 课程时间
- `course_name`: 课程名称
- `course_loc`: 上课地点

#### 响应结果示例

```json
[
  {
    "course_time": "星期一第1-2节",
    "course_name": "生理心理学",
    "course_loc": "知明1-204"
  },
  {
    "course_time": "星期三第1-2节",
    "course_name": "军事理论",
    "course_loc": "知明2-202"
  },
  {
    "course_time": "星期三第3-4节",
    "course_name": "普通心理学Ⅱ",
    "course_loc": "立诚1-101"
  }
]
```

## 违章事件 API 接口

### 上传举报事件 `POST /violate/Report`

#### 请求参数

- `violate_lic`: 违章车辆车牌号
- `violate_loc`: 违章事件位置
- `file`: 违章事件影像

#### 响应结果

- `result`: 事件状态

#### 响应结果示例

```json
{
  "result": "上传成功"
}
```

### 请求指定数量的最近违章事件 `GET /violate/RecentEvents`

#### 请求参数

- `Event_number`: 请求事件的数量

#### 响应结果

- `violate_id`: 违章事件 ID、
- `violate_lic_num`: 违章车牌号
- `violate_loc`: 违章地点
- `createdAt`: 举报时间
- `user_id`: 被举报人 ID
- `user_name`: 被举报人名称
- `user_academy`: 被举报人所属学院
- `user_class_name`: 被举报人所属教学班

#### 响应结果示例

```json
[
  {
    "violate_id": "4",
    "violate_lic_num": "D2011",
    "violate_loc": "知明楼",
    "createdAt": "2023-04-10T21:49:45.000Z",
    "user_id": "116092021174",
    "user_name": "徐建",
    "user_academy": "地理科学学院",
    "user_class_name": "2022级地理科学(师范)2班"
  },
  {
    "violate_id": "3",
    "violate_lic_num": "C2312",
    "violate_loc": "桃李园",
    "createdAt": "2023-04-10T21:49:08.000Z",
    "user_id": "100002019011",
    "user_name": "柴文",
    "user_academy": "心理学院",
    "user_class_name": "2022级心理学类1班"
  }
]
```

### 随机请求一个未处理完成的违章事件 `GET /violate/RandomPendingEvent`

#### 请求参数

- `user_wxid`: 用户微信 openID

#### 响应结果

- `violate_id`: 违章事件 ID
- `violate_lic_num`: 违章车牌号
- `violate_loc`: 违章地点
- `violate_judger_wxid`: 评判过该事件的人员的 wxid,以`&&`分割

#### 响应结果示例

```json
{
  "violate_id": "2",
  "violate_lic_num": "B4755",
  "violate_loc": "桃李园",
  "violate_judger_wxid": "wx_685&&"
}
```

### 更新违章事件评判结果 `POST /violate/EventUpdate`

#### 请求参数

- `user_wxid`: 用户微信 openID
- `eventID`: 违章事件 ID
- `eventJug`: 违章事件评判结果

#### 响应结果

无有意义结果

#### 响应结果示例

```json
{
  "result": "事件已更新！"
}
```

### 获取所有学院的违章次数 `GET /violate/NumOfAcademyEvents`

#### 请求参数

- `time`: 查询事件日期，如`2023-05-22`

#### 响应结果

- `violate_time`: 违章时间
- `academy_name`: 学院名称
- `academy_event_num`: 学院违章次数

#### 响应示例

```json
[
    {
        "violate_time": "2023-05-22",
        "academy_name": "心理学院",
        "academy_event_num": 2
    },
    {
        "violate_time": "2023-05-22",
        "academy_name": "经济学院",
        "academy_event_num": 3
    },

    ...

    {
        "violate_time": "2023-05-22",
        "academy_name": "海外教育学院",
        "academy_event_num": 5
    }
]
```

### 获取所有区域的违章次数 `GET /violate/NumOfLocEvents`

#### 请求参数

- `time`: 查询事件日期，如`2023-05-22`

#### 响应结果

- `violate_time`: 违章时间
- `violate_loc`: 违章区域
- `violate_event_num`: 违章统计次数

#### 响应示例

```json
[
    {
        "violate_time": "2023-05-22",
        "violate_loc": "花香园",
        "violate_event_num": 1
    },
    {
        "violate_time": "2023-05-22",
        "violate_loc": "百草园",
        "violate_event_num": 0
    },

    ...

    {
        "violate_time": "2023-05-22",
        "violate_loc": "致广楼",
        "violate_event_num": 0
    }
]
```

## 道路信息 API 接口

### 请求指定时段和地点的预计交通流 `GET /road/TrafficFlow`

#### 请求参数

- `dormitory`: 出发位置，如`"李苑"、"李苑1"、"李苑1_110"`
- `target`: 到达位置，如`"知明"、"知明1"、"知明1-110"`
- `time`: 指定查询时间，如`"星期一"、"星期一第1-2节"`

#### 响应结果

- `dormitory`: 出发位置
- `target`: 到达位置
- `time`: 指定查询时间
- `quantity`: 流量

#### 响应结果示例

```json
{
  "dormitory": "李苑",
  "target": "致广",
  "time": "星期一第1-2节",
  "quantity": 48
}
```

### 请求当前某道路的交通状况 `GET /road/Traffic`

#### 请求参数

- `road_id`: 道路指定 ID

#### 响应结果

- `road_id`: 道路指定 ID
- `road_name`: 道路名称
- `traffic`: 道路流量

#### 响应结果示例

```json
{
  "id": "1",
  "road_name": "桃李路",
  "traffic": "32"
}
```

## WEB 端管理 API 接口

### 登入账户 `POST /web/login`

该 API 会为浏览器添加一个 Cookie `Cybercycle`,同时更新数据库内的 Cookie

#### 请求参数

- `account`: 登录账号
- `pswd`: 登录密码

#### 响应结果

- `status`: 分别为`账号不存在`,`密码错误`,`已登录`
- `Cybercycle`: 一个可用于获取登录信息的`加密Cookie`

#### 响应结果示例

```json
{
  "status": "已登录"
}
```

### 登出账户 `POST /web/logout`

该 API 会清除浏览器的 Cookie `Cybercycle`,同时更新数据库内的 Cookie

#### 请求参数

- `Cybercycle`: 用于记录登录信息的`加密Cookie`

#### 响应结果

- `status`: `已退出`

#### 响应结果示例

```json
{
  "status": "已退出"
}
```

### 获取账户信息 `GET /web/getinfo`

#### 请求参数

- `Cybercycle`: 用于记录登录信息的`加密Cookie`

#### 响应结果

- `user_name`: 用户名称
- `user_identify`: 用户身份

#### 响应结果示例

```json
{
  "user_name": "张三",
  "user_identify": "管理员"
}
```

### 更新学生信息 `POST /web/stuinfo/update`

该 API 会验证浏览器的 Cookie `Cybercycle`,验证管理员状态后，进行更新

#### 请求参数

- `Cybercycle`: 用于验证身份的`加密Cookie`
- `stuid`: 学生学号
- `stu_name`: 学生姓名
- `stu_cycle_sit`: 学生拥车情况,`0`为不拥有，`1`为拥有
- `stu_academy`: 学生学院
- `stu_bedroom`: 学生宿舍
- `stu_phone`: 学生手机号
- `stu_class_name`: 学生教学班名称
- `stu_credit`: 学生信誉分
- `stu_wxid`: 学生微信 ID
- \*`stu_cycle_id`: 学生车辆车牌(可选)

#### 响应结果

- `status`: 处理状态,分别为`身份错误`和`更新完成`

#### 响应结果示例

```json
{
  "status": "更新完成"
}
```

## 小程序端管理 API 接口

### 绑定微信账号与学号 `POST /wxmini/UpdateBind`

#### 请求参数

- `x-wx-openid`: 微信 openID
- `stu_id`: 绑定对象的学号

#### 响应结果

- `status`: 处理状态,`已绑定`或`用户不存在`

#### 响应结果示例

```json
{
  "status": "已绑定"
}
```

## License

[MIT](./LICENSE)
