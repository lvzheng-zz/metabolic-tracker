# 新手版：先把网页上线

目标先缩小：先让 `https://health.384571259.xyz` 能打开这个减脂记录。

不要一开始就同时弄 OSS、RAM、OpenAI、双域名。那些可以第二步再补。

## 第一步：双击准备包

双击：

```text
outputs/metabolic-tracker/deploy/aliyun/one-click-prepare.cmd
```

它会问你 3 件事：

- 网页登录账号：默认 `owner` 就行
- 网页登录密码：你自己记住，脚本不保存明文
- 上线子域名：默认 `health.384571259.xyz`

运行完会生成一个文件夹：

```text
outputs/aliyun-oneclick/
```

里面最重要的是：

- `metabolic-tracker-fc-upload.zip`：上传到阿里云函数计算
- `env-to-copy.txt`：复制到函数计算环境变量
- `steps-for-console.txt`：照着点控制台

## 第二步：阿里云函数计算

控制台里只看这几个词：

- 地域：中国香港
- 类型：Web 应用 / Web 函数
- 运行环境：Node.js
- 上传代码：`metabolic-tracker-fc-upload.zip`
- 启动命令：`npm start`
- 端口：如果问就填 `3000`

## 第三步：环境变量

把 `env-to-copy.txt` 里前 6 行基础变量复制进去。

先不要填 OSS 和 OpenAI，那是第二阶段。

## 第四步：域名

只新增：

```text
health.384571259.xyz
```

不要修改：

```text
@ A 122.192.196.184
```

## 上线后

打开：

```text
https://health.384571259.xyz
```

如果网页能打开，第一阶段就完成。之后再开：

- 稳定多设备同步：配置 OSS
- 拍照识别：配置 OpenAI 或阿里云视觉模型
