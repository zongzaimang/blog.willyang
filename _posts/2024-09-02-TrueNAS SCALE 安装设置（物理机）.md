---
layout: mypost
title: 如何使用“机场”配置Clash等软件
categories:
  - TrueNAS
---
[哔哩哔哩视频](https://www.bilibili.com/video/BV1q3411i7Nq?share_source=copy_web)

# 下载镜像

浏览器打开官网[truenas.com](https://www.truenas.com/)  
如图点击TrueNAS SCALE，跳转到下载页面，

[![3SZAV8I8(YP@%C@IGV%NL1C.png](https://www.truenasscale.com/usr/uploads/2021/12/2296186754.png "3SZAV8I8(YP@%C@IGV%NL1C.png")](https://www.truenasscale.com/usr/uploads/2021/12/2296186754.png)
往下滑点击**No Thanks. Take me to the Download Page**  
[![AVQ4{S2%%{8`53U3BXDV_6.png](https://www.truenasscale.com/usr/uploads/2021/12/4229591133.png "AVQ4{S2%%{8`53U3BXDV_6.png")](https://www.truenasscale.com/usr/uploads/2021/12/4229591133.png)

然后点击**Download Now**
[![](https://www.truenasscale.com/usr/uploads/2021/12/560017632.png)](https://www.truenasscale.com/usr/uploads/2021/12/560017632.png)

# 制作启动盘

下载好镜像后，推荐使用[rufus](https://rufus.ie/zh/)制作安装盘  
[![](https://www.truenasscale.com/usr/uploads/2021/12/3050797825.png)](https://www.truenasscale.com/usr/uploads/2021/12/3050797825.png)
如果你的NAS支持UEFI的话记得分区类型要选GPT，然后点击开始。提示写入模式选择**DD模式**  
[![](https://www.truenasscale.com/usr/uploads/2021/12/500850258.png)](https://www.truenasscale.com/usr/uploads/2021/12/500850258.png)

后面全部点**是**就可以了

# 设置BIOS U盘启动

NAS插入U盘开机，按F11（这里根据自己的主板查询选择启动项的按键），选择刚刚做的U盘，等待进入安装界面。

# 安装系统

[![](https://www.truenasscale.com/usr/uploads/2021/12/243701706.png)](https://www.truenasscale.com/usr/uploads/2021/12/243701706.png)

选择**Install/Upgrade**  
然后选择你要把系统安装到的硬盘，按空格选择，回车确定  
[![](https://www.truenasscale.com/usr/uploads/2021/12/1053706883.png)](https://www.truenasscale.com/usr/uploads/2021/12/1053706883.png)

[![请输入图片描述](https://www.truenasscale.com/usr/uploads/2021/12/2534987282.png "请输入图片描述")](https://www.truenasscale.com/usr/uploads/2021/12/2534987282.png)

[请输入图片描述](https://www.truenasscale.com/usr/uploads/2021/12/2534987282.png)

选择**yes**后面也选择**yes**

[![](https://www.truenasscale.com/usr/uploads/2021/12/865270335.png)](https://www.truenasscale.com/usr/uploads/2021/12/865270335.png)

  
选择创建SWAP **Create swap**  
[![](https://www.truenasscale.com/usr/uploads/2021/12/1859371221.png)

](https://www.truenasscale.com/usr/uploads/2021/12/1859371221.png)  
设置root的密码

然后根据提示继续安装，安装完成后拔掉U盘重启，进入系统继续安装

# 排错

如果U盘安装完成，进入系统安装卡主报错，可以尝试把安装系统的硬盘分区彻底删除干净（推荐使用diskgenius），重新安装。