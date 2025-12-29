---
layout: mypost
title: Spotify PWA
categories:
  - PWA
---
从零开始，在电脑上把 Spotify 变成一个轻量、无广告的桌面应用。相比于传统的安装包，**PWA (Progressive Web App)** 占用空间更小，运行速度更快。

---

## 🛠️ 第一步：注册 Spotify 账号

如果你还没有账号，请按照以下步骤操作：

1. 打开 Chrome 浏览器，访问 [Spotify 官网](https://www.spotify.com/)。
    
2. 点击右上角的 **“注册” (Sign Up)**。![Pasted image 20251229145016.png](https://s2.loli.net/2025/12/29/kf71vqGrZxdTQwJ.png)
    
3. 你可以选择使用 **Google 账号** 或 **Facebook 账号** 快速登录，也可以使用邮箱手动注册。
    
    - _注意：如果你的地区无法直接访问，请确保你的网络环境处于可访问状态。_
        
4. 根据提示填写你的生日、性别和昵称，完成验证。
    

---

## 🖥️ 第二步：安装 Spotify PWA 并固定到任务栏

PWA 可以让网页版 Spotify 像独立软件一样运行，没有浏览器顶部的地址栏和标签页。

### 1. 安装 PWA

1. 登录你的 Spotify 账号后，进入 [Spotify 播放器页面](https://open.spotify.com/)。
    
2. 观察 Chrome 浏览器的 **地址栏右侧**，你会看到一个类似于“电脑+箭头”的图标（或者是三个点菜单里的“安装 Spotify”）。
    
3. 点击该图标，在弹出的窗口中选择 **“安装”**。![Pasted image 20251229145514.png](https://s2.loli.net/2025/12/29/xKPpdJ8wUHc5gaT.png)
    
4. 现在，Spotify 会在一个独立的窗口中重新打开。
    

### 2. 固定到任务栏

1. 安装完成后，Spotify 的图标会自动出现在你的桌面上。
    
2. 此时，你会发现任务栏（屏幕底部）出现了 Spotify 图标。
    
3. **右键点击** 任务栏上的 Spotify 图标，选择 **“固定到任务栏” (Pin to taskbar)**。
![Pasted image 20251229144912.png](https://s2.loli.net/2025/12/29/xeqJs7WObCZ3i4H.png)
    
    - 这样以后你只需点击任务栏图标就能直接听歌，无需先打开 Chrome。
        

---

## 🚫 第三步：安装 Blockify 插件跳过广告

由于网页版 Spotify 免费用户会有音频和视觉广告，我们可以通过 Chrome 插件来实现自动化静音或跳过。

1. 打开 [Chrome 网上应用店](https://chrome.google.com/webstore/)。
    
2. 搜索 **“Spotify Ad Blocker - Blockify”** 或类似的屏蔽插件。
    
3. 点击 **“添加至 Chrome”**。![Pasted image 20251229145653.png](https://s2.loli.net/2025/12/29/lqftDIxBZFKVk4c.png)
    
4. **关键步骤：** 由于 PWA 是基于 Chrome 运行的，插件会自动在 PWA 窗口中生效。
    
5. 安装后，点击 Chrome 右上角的“拼图”图标，将 Blockify **固定 (Pin)** 出来，确保它是开启状态。![Pasted image 20251229145725.png](https://s2.loli.net/2025/12/29/k5hIFHXUurGSL86.png)
    

> **提示：** 插件通常通过在检测到广告时自动静音并快速跳过来工作。如果广告没能跳过，请刷新 PWA 窗口。

---

## 💡 使用小贴士

- **快捷键：** 在 PWA 模式下，你依然可以使用键盘上的媒体键（播放/暂停、上一首、下一首）来控制音乐。
    
- **同步：** PWA 版支持 Spotify Connect，你可以用手机作为远程操控，控制电脑端播放。
    
- **深色模式：** Spotify 默认就是深色模式，非常适合夜间使用。
    
