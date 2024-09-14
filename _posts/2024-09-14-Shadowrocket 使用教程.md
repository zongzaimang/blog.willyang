---
layout: mypost
title: Shadowrocket 使用教程
categories:
  - Shadowrocket
---
Shadowrocket 有两种导入方式:

方式一：一键订阅（适用于较新版本的Shadowrocket客户端）  
方式二：手动订阅（适用于所有版本的Shadowrocket客户端，不推荐）  
请确保Shadowrocket App版本不低于2.1.70，否则可能无法正确支持Trojan协议。

### 方式一：一键订阅

1、使用Safari浏览器登录进入个人中心，在**仪表盘**页面下方的**捷径**区域找到“**一键订阅**”按钮，点击并选择“**导入到Shadowrocket**”选项。

点击后iOS系统会跳转到Shadowrocket客户端内并自动将节点订阅信息填好。

![](https://wikibos.com/wp-content/uploads/2023/04/ios-import-new-01-1.png)

---

2、在客户端**首页**可以看到一键订阅生成的所有节点及相关信息。

![](https://wikibos.com/wp-content/uploads/2022/01/shadowrocket-new-01.png)

---

3、进入**配置**选项页，建议使用默认配置文件即可。

![](https://wikibos.com/wp-content/uploads/2018/11/5-1.png)

---

4、进入**设置**选项页，按照下图将**订阅**设置项的“**打开时更新**”和“**自动后台更新**”选项同时开启。

![](https://wikibos.com/wp-content/uploads/2022/01/shadowrocket-new-03.png)

---

5、回到**首页**点击上方**全局路由**可以更改代理模式，其中：  
“**配置**”为配置文件代理（即按照规则自动分流）  
“**代理**”为全局代理（即所有连接均通过代理）  
“**直连**”为绕过代理（即所有连接均不通过代理）  
“**场景**”适用于不同网络环境下自动切换代理模式

非高级用户推荐使用默认的“**配置**”模式进行自动分流。

点击**首页**右上方系统总开关即可开启代理服务。（参考方式一步骤2附图）

---

### 方式二：手动订阅

1、使用Safari浏览器登录进入个人中心，在**仪表盘**页面下方的**捷径**区域找到“**一键订阅**”按钮，点击“**复制订阅地址**”选项，

点击后会将订阅地址复制到iOS系统剪贴板中，以供下一步手动导入使用。

![](https://wikibos.com/wp-content/uploads/2023/04/ios-import-new-02-1.png)

---

2、进入客户端**首页**，选择右上角 + 按键。

![](https://wikibos.com/wp-content/uploads/2018/11/2-1.png)

---

3、类型选择「**Subscribe**」，将第一步复制的订阅地址粘贴到**URL栏**中，在下方**备注**区域输入分组名称，最后点击右上角**完成**按钮保存。

![](https://wikibos.com/wp-content/uploads/2022/01/shadowrocket-new-02.png)

---

4、回到客户端**首页**，可以看到客户端已经自动下载好所有节点及相关信息。

![](https://wikibos.com/wp-content/uploads/2022/01/shadowrocket-new-01.png)

---

5、进入**配置**选项页，建议使用默认配置文件即可。

![](https://wikibos.com/wp-content/uploads/2018/11/5-1.png)

---

6、进入**设置**选项页，按照下图将**订阅**设置项的“**打开时更新**”和“**自动后台更新**”选项同时开启。

![](https://wikibos.com/wp-content/uploads/2022/01/shadowrocket-new-03.png)

---

7、回到**首页**点击上方**全局路由**可以更改代理模式，其中：  
“**配置**”为配置文件代理（即按照规则自动分流）  
“**代理**”为全局代理（即所有连接均通过代理）  
“**直连**”为绕过代理（即所有连接均不通过代理）  
“**场景**”适用于不同网络环境下自动切换代理模式

非高级用户推荐使用默认的“**配置**”模式进行自动分流。

点击**首页**右上方系统总开关即可开启代理服务。（参考方式二步骤4附图）

---

### 进阶操作：可选第三方配置文件

注意：

1. BosLife不提供任何进阶操作指导，也不接受关于进阶功能的工单支持请求，无经验的用户请一定不要操作进阶功能。  
2. 进阶操作仅适用于客户端v2.0.0及更新版本。

使用 Shadowrocket 客户端的用户可以自己指定所需的第三方配置文件，相比客户端自带的默认订阅配置文件，第三方配置文件还可以实现：

- 可随时更新由第三方开发者提供的最新分流规则列表。
- 可使用符合自己需求的白名单模式配置文件或黑名单模式配置文件。
- 支持 DoH / DoT，可以根据需求自行决定选用 DNS 服务器的种类和组合方式，例如：混用服务器来实现最佳解析速度；单独 DoH 使用来达到最佳安全性和最低污染度。

###### 操作步骤（简略）

1. 进入**配置**选项页，点击右上方的 “**+**” 按钮新增配置文件。
2. 在弹出的输入栏中粘贴第三方配置文件地址，然后点击下载按钮即可。  
    ![🔹](https://s.w.org/images/core/emoji/11/svg/1f539.svg)第三方配置文件样例（白名单过滤规则）：  
    `https://raw.githubusercontent.com/Johnshall/Shadowrocket-ADBlock-Rules-Forever/release/sr_top500_whitelist.conf`  
    ![🔹](https://s.w.org/images/core/emoji/11/svg/1f539.svg)第三方配置文件样例（带策略组懒人配置）：  
    `https://raw.githubusercontent.com/Johnshall/Shadowrocket-ADBlock-Rules-Forever/release/lazy_group.conf`  
    更多规则可查看：[https://github.com/Johnshall/Shadowrocket-ADBlock-Rules-Forever](https://github.com/Johnshall/Shadowrocket-ADBlock-Rules-Forever "https://github.com/Johnshall/Shadowrocket-ADBlock-Rules-Forever")
3. 用户可保存多份不同的配置文件，方便来回切换。

---

注意事项：

1. 个人专属配置文件是你个人账号密码及节点的总集成，不能泄露给任何人及网络，以防止他人使用及知晓你的密码。  
2. 建议将软件设置中「服务器订阅」改成「打开时更新」，这样每次启动软件即可自动更新节点地址。  
3. Shadowrocket如果出现BUG请联系软件作者，BosLife无法解决客户端层面问题。  
4. Shadowrocket是收费软件，请自行在App Store中搜索购买，本站与Shadowrocket并无任何利益关联。