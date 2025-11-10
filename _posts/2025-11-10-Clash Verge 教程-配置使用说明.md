---
layout: mypost
title: Clash Verge 教程-配置使用说明
categories:
  - Windows
  - macOS
  - Linux
---
# Clash Verge 教程-配置使用说明

本文包括Clash Verge 详细使用教程以及配置说明。Clash Verge 是流行的桌面网络代理翻墙客户端，界面简洁，功能强大，使用方便。

目前 Clash Verge Rev 仅提供桌面版，Windows\macOS\Linux，暂未推出手机版。

对于 Android 用户，推荐 [Clash Meta for Android](https://clashmetaforandroid.com/)。它跟 Clash Verge Rev 一样同样采用 Mihomo 内核，功能强大，简单易用。

对于 iOS 用户，推荐 [Sing-Box](https://getsingbox.com/)。在 iOS 应用市场中，Sing-Box 是少有的免费好用的代理应用。


## **下载和安装**

1.直接从[Github](https://github.com/clash-verge-rev/clash-verge-rev)上下载。

2.或着从 https://clashverge.net 下载 Clash Verge。Windows 用户可选择下载 `.msi` 或 `.exe` 安装文件，Mac 用户根据自己的芯片型号（Intel 或 M1/M2）下载相应的 `.dmg` 文件根据操作系统从下载对应平台的安装包进行安装。

按照提示完成安装。安装完成后，可在设置中将界面语言切换为中文。

PS: Clash Verge 只是客户端，需要配合代理节点一起使用，如果还没有购买代理服务，可以参考[机场推荐](https://blog.willyang.space/posts/2024/09/10/%E6%9C%BA%E5%9C%BA%E6%8E%A8%E8%8D%90.html)。

## **配置代理**

在 Clash Verge 中配置代理。首先在应用界面的 “配置” 部分填入代理配置信息的 URL（通常由代理服务商提供）。然后点击 “导入” 导入代理配置文件。

如果是自建节点服务器，需要自行编辑配置文件并导入，注意 Clash Verge 支持的协议包括：Shadowsocks(SS)、ShadowsocksR(SSR)、Socks、Snell、V2Ray、Trojan 等。

![Clash Verge 教程 订阅](https://clashverge.net/wp-content/uploads/2024/03/profile-zh.webp)

## **选择代理节点**

选择一个代理节点。这取决于代理服务商提供的配置。代理节点通常在 Clash Verge 的 “代理” 页面中列出。

![Clash Verge 教程 分组](https://clashverge.net/wp-content/uploads/2024/03/proxy-zh.webp)

## **设置系统代理模式**

代理配置完成后，还需要设置系统代理才能实现科学上网。

首先在左侧选中**设置**，然后在右侧找到**系统代理**，点击右侧按钮启动。

启动后，还可以在首页代理页面选择模式：

- **全局模式**（Global）：所有请求直接通过代理服务器。
- **规则模式**（Rule）：根据配置文件的规则进行分流，只有需要代理的网站才会经过代理服务器。(推荐)
- **直连模式**（Direct）：所有请求直接发送到目的地

![Clash Verge 教程 开启代理](https://clashverge.net/wp-content/uploads/2024/03/settings-zh.webp)

## **开始使用**

启动系统代理后，您就可以开始浏览或使用被墙的网站和服务了。首次使用时建议在隐私模式下打开谷歌或Twitter测试，以避免浏览器插件影响代理的正常使用。

## **其他设置与建议**

- **语言切换**：在设置中可将 Clash Verge 切换为中文界面。
- **内核切换**：可在设置中切换至 Clash Meta 内核，以支持更多类型的节点。
- **导入机场订阅地址**：直接从机场后台复制订阅地址，然后在 Clash Verge 中导入。
- **默认端口**：Clash Verge 的默认端口与 Clash for Windows 相同，为 7890，适用于如 Telegram 等应用的代理设置。
- **Tun 模式**：开启后会生成虚拟网卡，使所有流量都通过代理。