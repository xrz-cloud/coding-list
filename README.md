# coding-list

## 镜像

[GitHub](https://github.com/xrz-cloud/coding-list)(推荐)  
[Gitee](https://gitee.com/xrz-cloud/coding-list)  
[CODING](https://xrzyun.coding.net/public/xrz-video/coding-list/git/files)  

## 目录

[前言](#前言)  
[安装](#安装)  
[选项及配置](#选项及配置)  

## 前言

本分享程序文件储存于[CODING](//coding.net)提供的腾讯云COS对象存储,稳定性有保障(bushi  
本程序参(piao)考(qie)于[此网站](//od-api.vercel.app),其原本是OneDrive目录分享程序,反正就是我对其HTML和JS魔改得到的。  

示范站:[XRZ's CODING-LIST](//api.xrzyun.top/coding/list)  

样式来自[onedrive-cf-index](https://github.com/spencerwooo/onedrive-cf-index),写API的灵感来自[sosf](https://github.com/beetcb/sosf).程序部署在[Vercel](https://vercel.com)上,免费的API请求量够用，详情请看[官方文档](https://vercel.com/pricing)。  

将白嫖发挥至极致，本程序运行不花1分钱，把提供文件存储的CODING作为后台，尽量减少账号注册量。

## 安装

#### 1.克隆本储存库

点击部署项目，注意：

1. 第二步`Create a Team`时，直接点击Skip。
2. 第三步`Configure Project`时，点击`Required Environment Variables`展开，按照如下设置(下面还要用)：
`coding_token`:用子账户(如果在创建了的话)(可以用主账户)([创建TOKEN及子账号参考](https://github.com/xrz-cloud/coding-list/tree/917e1500ffc24fa92e5c17e8b0204ea21f82ca3c#2%E9%85%8D%E7%BD%AE%E5%8F%82%E6%95%B0))新建一个TOKEN。
提示：令牌描述可以随便填。建议权限勾选project:file,project:issue以保证以后继续可用，但现在全不勾选的权限也够用了（玄学，所以这里的精细权限设置只能靠新建子用户了）。
请复制创建的TOKEN并填入下框。
`coding_ProjectName`:你想要创建项目的名称，建议填`clist`
`title`:你网站想要的名字（可选）

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fxrz-cloud%2Fcoding-list&env=coding_token,coding_ProjectName,title&project-name=clist&repo-name=clist)

#### 2.配置(从零开始)

1. 请打开部署得到的网站，在域名后加上`/init`来初始化。
Demo:
网站主页`https://coding-list-ac6f.vercel.app`
初始化界面`gttps://coding-list-ac6f.vercel.app/init`

2. 第三步创建项目时，项目名称请填上文中的`coding_ProjectName`，项目标识随意，但不能与已有CODING项目标识重复。

3. 第四步中，CODING TOKEN请填写上文中`coding_token`,网站标题随意。(无论之前`title`为何，均以这里填写的为准。)

其余部分，请按照当页描述填写。

## 选项及配置

### 导航

- [INDEX首页加载项](#INDEX首页加载项)
  - [描述](#描述)
- [美化项](#美化项)
  - [进度条颜色](#进度条颜色)
- [CODING后台项](#CODING后台项)
  - [修改描述](#修改描述)
  - [附件](#附件)
  - [子工作项](#子工作项)

### INDEX首页加载项

#### 描述

描述可以识别JSON或文本，若直接输入文本，则在顶部显示此文本，与

```json
{"textarea":{"top":"${你输入的文本}","bottom":""}}
```

这段JSON等价。  
描述支持HTML标签，可以直接输入，也可通过插入JSON来自定义。  

范例描述：  

```json
{\"textarea\":{\"top\":\"欢迎访问CODING-LIST文件分享！<br>本分享程序文件储存于CODING提供的腾讯云COS对象存储。<br>稳定性有保障(bushi\",\"bottom\":\"本程序开源于GitHub <a href='//github.com/xrz-cloud/coding-list' target='_blank'>跳转</a>\"}}
```

意思是，在顶部显示
>欢迎访问CODING-LIST文件分享！<br>本分享程序文件储存于CODING提供的腾讯云COS对象存储。<br>稳定性有保障(bushi

```html
欢迎访问CODING-LIST文件分享！<br>本分享程序文件储存于CODING提供的腾讯云COS对象存储。<br>稳定性有保障(bushi
```

在底部显示
>本程序开源于GitHub <a href='//github.com/xrz-cloud/coding-list' target='_blank'>跳转</a>

```html
本程序开源于GitHub <a href='//github.com/xrz-cloud/coding-list' target='_blank'>跳转</a>
```

##### 注意事项1

`"Description"`后面是**双引号包裹**的经过**转义**的JSON，编辑完JSON后，记得要转义，这里提供[一个转义网站](//www.bejson.com/)。  

#### 以CODING事项作为首页

打开`web/js/coding-list-app.js`，找到第505行，修改`"/"`为`"?code=把我改为一个IssueCode"`。  
原文件：  

```js
if (code == 0) window.location = "/"
```

修改范例：

```js
if (code == 0) window.location = "?code=81"
```

### 美化项

#### 进度条颜色

打开`web/js/coding-list-app.js`，找到第23行，修改

```js
const theme = "#a685e2"
```

把16进制颜色`#a685e2`改为你想要的。  

### CODING后台项

#### 修改描述

参考 [选项/INDEX首页加载项/描述](#描述)。

##### 注意事项2

CODING后台中，若要使用JSON配置，请不要转义，否则可能会导致显示出错。  

#### 附件

随便上传附件吧，本程序的核心在此，因为附件上传没有限制，反正我传了约100GB的视频，现在没有翻车。不过还是节制一点，以免又少了一个免费文件分享的渠道。  

#### 子工作项

文件夹功能就是靠此实现的，你可以在子工作项中上传附件，即在子文件夹中浏览文件。  

## 信息

本程序以[MIT](LICENSE)协议开源。  
提意见可以开Issue，或发邮件至`admin@xrzyun.top`。  
欢迎提交PR。  
