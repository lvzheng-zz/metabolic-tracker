# 阿里云上线方案

## 新手先走这条

双击：

```text
outputs/one-click-prepare.cmd
```

脚本会生成：

- `outputs/aliyun-oneclick/metabolic-tracker-fc-upload.zip`
- `outputs/aliyun-oneclick/env-to-copy.txt`
- `outputs/aliyun-oneclick/steps-for-console.txt`

第一阶段只做一件事：让 `https://health.384571259.xyz` 能打开网页。

先不要配置 OSS、RAM、OpenAI、双域名。网页能打开后，再开稳定同步和拍照识别。

## 当前控制台检查

- `384571259.xyz` 在云解析 DNS 中已有 1 条记录：`@ A 122.192.196.184`。
- 这条记录看起来是主域名现有业务，部署减脂记录时不要修改。
- 新手版只新增一个子域名：`health.384571259.xyz`。
- 如果域名没有 ICP 备案，优先选中国香港地域，避免大陆静态站/函数自定义域名备案卡住。

## 推荐架构

- 前端和接口：先放在同一个函数计算 Web 应用里，少配一个域名。
- 数据同步：后续通过 `/api/auth/login` 登录，`/api/sync` 保存/读取个人 JSON。
- 稳定存储：第二阶段再接私有 OSS bucket。
- 饮食拍照：第二阶段再接 OpenAI 或阿里云百炼/Qwen-VL。
- 登录：单账号密码，同设备通过浏览器 localStorage 记住 token。

## 前端配置

上线后在网页 `数据 -> 云端同步` 中设置：

- 云接口：`/api`
- 账号：`APP_USERNAME`
- 密码：你设置的登录密码

个人中心里的 AI 饮食识别接口建议设置：

- `/api/recognize-food`

拍照识别要能真实调用，还需要在函数计算环境变量里增加：

- `OPENAI_API_KEY=你的 OpenAI 或兼容接口 Key`
- `OPENAI_MODEL=gpt-4o-mini`
- `OPENAI_BASE_URL=https://api.openai.com/v1`
- `OPENAI_API_STYLE=chat`

如果使用阿里云百炼/DashScope，可以改用：

- `DASHSCOPE_API_KEY=你的百炼 API Key`
- `DASHSCOPE_WORKSPACE_ID=你的业务空间 ID`
- `DASHSCOPE_REGION=cn-beijing`
- `DASHSCOPE_MODEL=qwen-vl-plus`
- `OPENAI_API_STYLE=chat`

百炼控制台没有香港地域是正常的。模型服务选 `华北2（北京）`，这里对应 `DASHSCOPE_REGION=cn-beijing`；函数计算和自定义域名仍然部署在中国香港。

网页饮食页里有 `接口自检`，可以确认线上函数是否已部署新版、Key 是否已配置、模型和接口地址是否生效。

## Apple 健康 / 电子秤自动同步

- 网页不能直接后台读取 Apple 健康或蓝牙电子秤。
- 自动同步走 `/api/health/import`：iPhone 快捷指令读取 Apple 健康，再 POST 到这个接口。
- 电子秤需要先通过厂商 App 写入 Apple 健康里的体重/体脂。
- 数据页登录云端后，点 `复制快捷指令配置` 可以复制 URL、Authorization 和示例 JSON。
- 可选长期方案：在函数环境变量加入 `APP_HEALTH_IMPORT_TOKEN`，快捷指令用请求头 `X-Health-Import-Token`，避免登录 token 到期。

## 环境变量

新手版直接复制 `outputs/aliyun-oneclick/env-to-copy.txt` 前 6 行。

不要把环境变量发到聊天里。

## 需要确认后才能执行的动作

这些动作会改变云账号或域名状态，需要单独确认：

- 创建 OSS bucket、函数计算服务或 RAM AccessKey。
- 保存 DNS 解析记录，例如新增 `health` / `health-api`。
- 绑定 SSL 证书或自定义域名。
- 开通百炼、OpenAI、短信、日志、监控等可能计费服务。

## 最小上线顺序

1. 双击 `outputs/one-click-prepare.cmd`。
2. 创建函数计算 Web 应用，上传 `outputs/aliyun-oneclick/metabolic-tracker-fc-upload.zip`。
3. 启动命令填 `npm start`，如果问端口填 `3000`。
4. 复制 `outputs/aliyun-oneclick/env-to-copy.txt` 前 6 行到环境变量。
5. 配置 `health.384571259.xyz` 到函数计算。
6. 打开页面确认能访问。

注意：上传包必须用 `one-click-prepare.ps1` 生成，脚本会把 zip 内路径写成 Linux 可识别的 `/`。不要直接用 Windows `Compress-Archive` 手工压缩，否则阿里云可能找不到 `api/recognize-food.js`。
