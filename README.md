# 代谢减脂记录

个人代谢健康和减脂记录网页版，主项目在：

```text
outputs/metabolic-tracker/
```

## 本地运行

```powershell
cd outputs/metabolic-tracker
npm install
npm start
```

浏览器打开：

```text
http://localhost:3000/
```

## 直接静态打开

也可以直接打开：

```text
outputs/metabolic-tracker/index.html
```

但拍照 AI、登录和云同步接口需要通过 `npm start` 或线上函数运行。

## 阿里云部署

部署说明在：

```text
outputs/metabolic-tracker/deploy/aliyun/
```

真实环境变量、上传 zip、云端数据文件不要提交到 Git。重新部署前运行：

```powershell
outputs/metabolic-tracker/deploy/aliyun/one-click-prepare.ps1
```

## 继续开发

项目规则在：

```text
AGENTS.md
.agents/skills/metabolic-health-app-dev/SKILL.md
```
