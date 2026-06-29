# 手动控制台部署清单（新手版）

> 浏览器安全策略阻止 Codex 直接操作函数计算控制台时，用这份清单手动部署。

## 0. 已准备好的文件

先双击运行：

- `outputs/metabolic-tracker/deploy/aliyun/one-click-prepare.cmd`

它会生成：

- `outputs/aliyun-oneclick/metabolic-tracker-fc-upload.zip`
- `outputs/aliyun-oneclick/env-to-copy.txt`
- `outputs/aliyun-oneclick/steps-for-console.txt`

## 1. 不要修改的记录

云解析 DNS 中 `384571259.xyz` 当前有：

- `@ A 122.192.196.184`

这条是主域名现有业务，不要改、不要删。

## 2. 函数计算

1. 打开阿里云函数计算 FC。
2. 地域选择中国香港。
3. 创建 Web 应用或函数应用。
4. 运行环境选择 Node.js。
5. 上传 `outputs/aliyun-oneclick/metabolic-tracker-fc-upload.zip`。
6. 启动命令填：`npm start`。
7. 监听端口使用平台默认 `PORT` 环境变量，代码会自动读取。

## 3. 环境变量（先只填基础 6 行）

从 `outputs/aliyun-oneclick/env-to-copy.txt` 复制前 6 行：

- `ALLOWED_ORIGIN=https://health.384571259.xyz`
- `APP_USERNAME=你的登录账号`
- `APP_PASSWORD_SALT=脚本已生成`
- `APP_PASSWORD_SHA256=脚本已生成`
- `APP_JWT_SECRET=一串长随机字符`
- `APP_TOKEN_TTL_SECONDS=2592000`

先不要填 OSS 和 OpenAI。网页先上线，第二阶段再开。

如果后续要启用稳定跨设备同步，再填：

- `OSS_REGION=oss-cn-hongkong`
- `OSS_BUCKET=你的私有 bucket 名`
- `OSS_ACCESS_KEY_ID=RAM 子用户 AccessKey`
- `OSS_ACCESS_KEY_SECRET=RAM 子用户 AccessKeySecret`
- `OSS_STATE_PREFIX=metabolic-tracker`

如果后续要启用拍照识别，再填：

- `OPENAI_API_KEY=你的 OpenAI Key`
- `OPENAI_MODEL=当前可用的视觉模型`

## 4. OSS 私有 bucket

第一阶段可以跳过。

第二阶段要稳定云同步时再做：

1. 创建一个中国香港地域的 OSS bucket。
2. 读写权限选择私有。
3. 不需要开静态网站托管。
4. 只用于保存同步 JSON。

## 5. 自定义域名

推荐先只用一个域名：

- `health.384571259.xyz`

把它绑定到函数计算 Web 应用。这样前端和 `/api/...` 接口在同一个域名下，少一半跨域问题。

DNS 只新增：

- `health` 的 CNAME 或 A 记录，按函数计算控制台给的目标值填写。

不要修改 `@` 记录。

## 6. 上线后网页设置

打开：

- `https://health.384571259.xyz`

在 `数据 -> 云端同步`：

- 云接口填：`/api`
- 账号填：`APP_USERNAME`
- 密码填：你设置的密码

在 `个人中心 -> AI 饮食识别`：

- 识别接口填：`/api/recognize-food`

## 7. 第一次同步

1. 电脑上打开网页并登录云同步。
2. 点“上传当前”。
3. 手机上打开同一网址，登录云同步。
4. 点“拉取云端”。
