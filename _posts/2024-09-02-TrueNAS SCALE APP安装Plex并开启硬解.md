---
layout: mypost
title: TrueNAS SCALE APP安装Plex并开启硬解
categories:
  - TrueNAS
---
[哔哩哔哩](https://www.bilibili.com/video/BV1EL41147B4/)

# 介绍

**Plex** 是一套[媒体播放器](https://zh.wikipedia.org/wiki/%E5%AA%92%E4%BD%93%E6%92%AD%E6%94%BE%E5%99%A8 "媒体播放器")及[媒体服务器](https://zh.wikipedia.org/wiki/%E5%AA%92%E4%BD%93%E6%9C%8D%E5%8A%A1%E5%99%A8)软件，让用户整理在设备上的[有声书](https://zh.wikipedia.org/wiki/%E6%9C%89%E8%81%B2%E6%9B%B8 "有声书")、[音乐](https://zh.wikipedia.org/wiki/%E9%9F%B3%E6%A8%82 "音乐")、[播客](https://zh.wikipedia.org/wiki/%E6%92%AD%E5%AE%A2 "播客")、[图片](https://zh.wikipedia.org/wiki/%E5%9C%96%E7%89%87 "图片")和[视频](https://zh.wikipedia.org/wiki/%E8%A7%86%E9%A2%91 "视频")文件，以供[流](https://zh.wikipedia.org/wiki/%E4%B8%B2%E6%B5%81 "流")至[移动设备](https://zh.wikipedia.org/wiki/%E6%B5%81%E5%8B%95%E8%A3%9D%E7%BD%AE "移动设备")、[智能电视](https://zh.wikipedia.org/wiki/%E6%99%BA%E8%83%BD%E9%9B%BB%E8%A6%96 "智能电视")和[电子媒体播放器](https://zh.wikipedia.org/w/index.php?title=%E9%9B%BB%E5%AD%90%E5%AA%92%E9%AB%94%E6%92%AD%E6%94%BE%E5%99%A8&action=edit&redlink=1)上。

# 安装

[![image.png](https://www.truenasscale.com/usr/uploads/2021/12/4014757305.png "image.png")](https://www.truenasscale.com/usr/uploads/2021/12/4014757305.png)


我们安装社区的PLEX，点击安装，名字填PLEX

[![image.png](https://www.truenasscale.com/usr/uploads/2021/12/2158455756.png "image.png")](https://www.truenasscale.com/usr/uploads/2021/12/2158455756.png)


- Advertise IP不要填
- Plex Claim Token登录[plex](https://www.plex.tv/claim)获取（必填）

点击下一步

网络默认点击下一步

上面的储存默认，点击添加  
[![image.png](https://www.truenasscale.com/usr/uploads/2021/12/3011937056.png "image.png")](https://www.truenasscale.com/usr/uploads/2021/12/3011937056.png)

[image.png](https://www.truenasscale.com/usr/uploads/2021/12/3011937056.png)

这里挂载你的影片等路径（数据集要给apps用户权限），点击下一步

ingress根据自己需求，点击下一步，一直到Resources and Devices

[![image.png](https://www.truenasscale.com/usr/uploads/2021/12/2053843068.png "image.png")](https://www.truenasscale.com/usr/uploads/2021/12/2053843068.png)


这里选择你的显卡**0是关1是开**  
点击下一步保存部署

**这里部署完成后如果显示无权限访问此服务器的话，重新生成Plex Claim Token编辑填入保存部署就可以了**

# 开启硬解

[![image.png](https://www.truenasscale.com/usr/uploads/2021/12/3107153189.png "image.png")](https://www.truenasscale.com/usr/uploads/2021/12/3107153189.png)


如图勾上可用时使用硬件转码（需开Plex PASS会员）

验证是否开启成功，播放一个影片选择转码，然后看后台的卡片上有没有写转码（HW）

**如果你觉得本教程对你有帮助，请随意打赏，谢谢。**