## 请求灾害信息 API 接口

### 请求所有灾害信息 `GET /disaster/allInfo`

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
[
  {
    "Info_id": "0",
    "province": "福建",
    "City": "厦门",
    "Address": "湖里街道",
    "Coordinate": "12.3,34.5",
    "OccurrenceTime": "2024-06-20T18:52:11.000Z",
    "Validation": 0,
    "MediaUrl": "['1234']",
    "createdAt": "2024-06-20T18:52:21.000Z",
    "updatedAt": "2024-06-20T18:52:23.000Z"
  }
]
```

### 请求某区域灾害信息 `GET /disaster/regionInfo`

#### 请求参数

- `region`: 区域
- `region_type`: 可以为`省`或`市`

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
[
  {
    "info_Id": "0",
    "province": "福建",
    "city": "厦门",
    "address": "湖里街道",
    "coordinate": "123,456",
    "occurrenceTime": "2024-06-11T21:01:51.000Z",
    "validation": 0,
    "mediaUrl": "123",
    "createdAt": "2024-06-20T21:02:00.000Z",
    "updatedAt": "2024-06-20T21:02:04.000Z"
  }
]
```
