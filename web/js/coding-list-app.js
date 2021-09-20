async function conf() {
  let ClistConfig = await fetch("/api/VCAPI")
  ClistConfig = await ClistConfig.json()
  ClistConfig = ClistConfig.info.conf
  ClistConfig = toml.parse(ClistConfig)
  ClistConfig["index"]["msg"]["Description"] = JSON.stringify(ClistConfig.index.msg.Description)
  Cookies.set("conf", JSON.stringify(ClistConfig), {
    "expires": new Date(Date.now() + Number(ClistConfig.refresh)),
    "path": "/"
  })
  console.log("提示：", "已成功获取配置信息。可使用reconf()函数立即刷新配置。")
  console.log("本次获取到的配置：", ClistConfig)
}
//API配置
const api = {
  "list": "/coding/list",
  "file": "/coding/file"
}
//参数获取
const code = new URLSearchParams(location.search).get("code")
const fileid = new URLSearchParams(location.search).get("id")
//美化配置 https://github.com/badrap/bar-of-progress#customization [进度条]
const theme = "#a685e2"
const progress = new barOfProgress({
  color: theme,
  delay: 50
})
//其它参数
const isIndex = code == 0

//const coding_hostname = "e.coding.net"//填写你的CODING团队域名

const title = (function () {
  if (!!Cookies.get("conf") == true) {
    return JSON.parse(Cookies.get("conf")).title
  }
}()) || "CODING-LIST | 文件分享" //填写你想要的网站标题

const prefetches = new Set()
const loadScriptList = new Set()
const loadStyleList = new Set()

//主页项目
const index = (function () {
  if (!!Cookies.get("conf") == true) {
    return JSON.parse(Cookies.get("conf")).index
  }
}()) || {
  "status": 200,
  "RequestId": "null",
  "msg": {
    "Type": "MISSION",
    "Name": "INDEX",
    "Description": "{\"textarea\":{\"top\":\"欢迎访问CODING-LIST文件分享！<br>本分享程序文件储存于CODING提供的腾讯云COS对象存储。<br>稳定性有保障(bushi\",\"bottom\":\"本程序开源于GitHub <a href='//github.com/xrz-cloud/coding-list' target='_blank'>跳转</a>\"}}",
    "Files": [],
    "SubTasks": [{
        "Code": 190,
        "Type": "SUB_TASK",
        "Name": "2021.4"
      },
      {
        "Code": 151,
        "Type": "SUB_TASK",
        "Name": "2021.1"
      },
      {
        "Code": 107,
        "Type": "SUB_TASK",
        "Name": "2020.10(部分在下面的文件夹)"
      }
    ],
    "Parent": 404
  }
}

/*const index = */

//下面的不要乱改---------------------------------------------
//函数部分 开始
function serilizeUrl(url) {
  let urlObject = {};
  if (/\?/.test(url)) {
    const urlString = url.substring(url.indexOf("?") + 1);
    const urlArray = urlString.split("&");
    for (var i = 0; i < urlArray.length; i++) {
      const urlitem = urlArray[i];
      const item = urlitem.split("=");
      urlObject[item[0]] = item[1];
    }
    return urlObject;
  }
  return null;
}

//时间类型转换 eg. Thu%2C%2001%20Jul%202021%2000%3A07%3A33%20GMT(Thu, 01 Jul 2021 00:07:33 GMT) 转 2021-07-01 08:07:33(北京时间GMT+8)
function exp2t(exp) {
  let d = new Date(exp.toString())
  d = `${d.getFullYear()}-${("0" + (d.getMonth() + 1)).slice(-2)}-${("0" + d.getDate()).slice(-2)} ${("0" + d.getHours()).slice(-2)}:${("0" + d.getMinutes()).slice(-2)}:${("0" + d.getSeconds()).slice(-2)}`
  return d
}

//时间差计算
function leftTime(endTime, now = new Date()) {
  let d, h, m, s, leftTime
  leftTime = endTime.getTime() - now.getTime()
  if (leftTime >= 0) {
    d = Math.floor(leftTime / 1000 / 60 / 60 / 24);
    h = Math.floor(leftTime / 1000 / 60 / 60 % 24);
    m = Math.floor(leftTime / 1000 / 60 % 60);
    s = Math.floor(leftTime / 1000 % 60);
  }
  return [d, h, m, s]
}

//---
//Coding fileid API
function getFileName(url) {
  let filename = serilizeUrl(url)
  filename = filename["response-content-disposition"]
  filename = filename.replace("attachment%3Bfilename%3D", "")
  return filename
}

function getEXPtime(url) {
  let exp = serilizeUrl(url)
  exp = exp["response-expires"]
  exp = decodeURIComponent(exp)
  exp = new Date(exp)
  return exp
}

//---

function typeJSONorTXT(str) {
  if (typeof str == 'string') {
    try {
      let obj = JSON.parse(str);
      return true;
    } catch (e) {
      console.log('error：' + str + '!!!' + e);
      return false;
    }
  }
  console.log('It is not a string!')
}

function loadScript(url, callback, crossorigin = true, async = true) {
  if (loadScriptList.has(url)) {
    if (callback) setTimeout(callback, 0)
    return
  }
  loadScriptList.add(url)
  window.requestAnimationFrame(() => {
    const script = document.createElement('script')
    script.src = url
    script.type = 'text/javascript'
    script.async = async
    if (crossorigin) script.crossOrigin = 'anonymous'
    if (callback) script.onload = callback
    document.head.appendChild(script)
  })
}

function loadStyle(url, callback, crossorigin = true) {
  if (loadStyleList.has(url)) {
    if (callback) setTimeout(callback(), 0)
    return
  }
  loadStyleList.add(url)
  window.requestAnimationFrame(() => {
    const link = document.createElement('link')
    link.href = url
    link.rel = 'stylesheet'
    if (crossorigin) link.crossOrigin = 'anonymous'
    if (callback) link.onload = callback
    document.head.appendChild(link)
  })
}

function getExtension(filename) {
  return filename.split('.').pop().toLowerCase()
}

function getFileType(extension) {
  if (['mp4', 'mkv', 'flv', 'webm', 'avi', 'mov', 'wmv'].includes(extension)) {
    return 'video'
  }
  if (['gif', 'jpeg', 'jpg', 'png', 'svg', 'webp', 'jfif', 'ico', 'bmp', 'avif'].includes(extension)) {
    return 'image'
  }
  if (['flac', 'mp3', 'wav'].includes(extension)) {
    return 'audio'
  }
  if (['7z', 'rar', 'bz2', 'xz', 'tar', 'gz', 'zip', 'iso'].includes(extension)) {
    return 'archive'
  }
  if (['js', 'sh', 'php', 'py', 'css', 'html', 'xml', 'ts', 'json', 'yaml', 'toml', 'txt', 'csv', 'ini', 'log', 'conf', 'list', 'srt', 'ass', 'ssa'].includes(extension)) {
    return 'code'
  }
  if (['md', 'markdown'].includes(extension)) {
    return 'md'
  }
  return ''
}

function getIconClass(name) {
  const extension = name.split('.').pop().toLowerCase()
  const fileType = getFileType(extension)
  switch (fileType) {
    case 'video':
      return 'far fa-file-video'
    case 'image':
      return 'far fa-file-image'
    case 'audio':
      return 'far fa-file-audio'
    case 'archive':
      return 'far fa-file-archive'
    case 'code':
      return 'far fa-file-code'
    case 'md':
      return 'fab fa-markdown'
    default:
      return `far fa-file`
  }
}

function formatSize(s = 0) {
  return s < 1024 ?
    s + ' B' :
    s < Math.pow(1024, 2) ?
    parseFloat(s / Math.pow(1024, 1)).toFixed(1) + ' KiB' :
    s < Math.pow(1024, 3) ?
    parseFloat(s / Math.pow(1024, 2)).toFixed(1) + ' MiB' :
    s < Math.pow(1024, 4) ?
    parseFloat(s / Math.pow(1024, 3)).toFixed(1) + ' GiB' :
    s < Math.pow(1024, 5) ?
    parseFloat(s / Math.pow(1024, 4)).toFixed(1) + ' TiB' :
    '> 1PiB'
}

const pushHtml = (s, dl_url, show_dl_btn = true, p = '1rem 1rem') => {
  document.getElementById('list').innerHTML = `<div style="padding: ${p};">${s}</div>`
  let btn_container = ''
  if (show_dl_btn) {
    btn_container += `<a class="button" data-raw="true" href="${dl_url}"><i class="far fa-arrow-alt-circle-down"></i> 下载</a>`
  }
  document.getElementById('btn').innerHTML = btn_container
}

const list_load = async (code) => {
  let res = await fetch(`${api.list}?code=${code}`)
  let data = await res.json()
  if (data.msg.Parent == 404) ParentCode = 0
  else if (data.msg.Parent.Code) ParentCode = data.msg.Parent.Code
  let {
    Description
  } = data.msg
  Description = Description.toString()
  Description = Description.replace(/\\/g, '')
  let list
  if (typeJSONorTXT(Description) == false) list = `<div style="padding: 1rem 1rem;"><div class="markdown-body" style="margin-top: 0; letter-spacing: .5px;"><p>${Description}</p></div></div>`
  if (typeJSONorTXT(Description) == true) {
    Description = JSON.parse(Description)
    if (Description.textarea.top) list = `<div style="padding: 1rem 1rem;"><div class="markdown-body" style="margin-top: 0; letter-spacing: .5px;"><p>${Description.textarea.top}</p></div></div>`
    if (Description.textarea.bottom) var list_bottom_text = Description.textarea.bottom
  }
  list += `<div class="item" ${isIndex ? 'style="display: none;"' : ''}><i class="far fa-folder"></i>..<a href="${isIndex ? "#" : "?code=" + ParentCode}">...</a></div>`
  let breadcrumb = `<a href="?code=0">🚩 Home</a>`
  if (data.msg.Type != "SUB_TASK") {
    for (item of data.msg.SubTasks) {
      const {
        Code,
        Name
      } = item
      list += `<div class="item">
        <i class="far fa-folder"></i>${Name}<div style="flex-grow: 1"></div>
        <a href="?code=${Code}" data-name="${Name}" data-type="folder">${Name}</a></div>`
    }
    for (item of data.msg.Files) {
      const {
        Name,
        Size,
        Url
      } = item
      list += `<div class="item">
        <i class="${getIconClass(Name)}"></i>${Name}<div style="flex-grow: 1"></div>
        <span class="size">${formatSize(Size)}</span>
        <a href="${Url}" data-name="${Name}" data-size="${Size}" data-type="file">${Name}</a></div>`
    }
    breadcrumb = breadcrumb + ` / [${code}]${data.msg.Name}`
  }
  if (data.msg.Type == "SUB_TASK") {
    for (item of data.msg.Files) {
      const {
        Name,
        Size,
        Url
      } = item
      list += `<div class="item">
        <i class="${getIconClass(Name)}"></i>${Name}<div style="flex-grow: 1"></div>
        <span class="size">${formatSize(Size)}</span>
        <a href="${Url}" data-name="${Name}" data-size="${Size}" data-type="file">${Name}</a></div>`
    }
    breadcrumb = breadcrumb + ` / <a href="?code=${ParentCode}">[${ParentCode}]${data.msg.Parent.Name}</a> / [${code}]${data.msg.Name}`
  }
  if (list_bottom_text) list += `<div style="padding: 1rem 1rem;"><div class="markdown-body" style="margin-top: 0; letter-spacing: .5px;"><p>${list_bottom_text}</p></div></div>`
  const html = `<div style="min-width: 280px;">${list}</div>`
  document.getElementById('list').innerHTML = html
  document.getElementById('breadcrumb').innerHTML = breadcrumb
  progress.finish()
}

const fileINFO_load = async (fileid) => {
  let res = await fetch(`${api.file}?id=${fileid}&w=json`)
  let data = await res.json()
  let filename = getFileName(data.msg.url)
  let exp = getEXPtime(data.msg.url)
  let exp_show = exp2t(exp)
  let lefttime = leftTime(exp)
  console.log(filename)
  let dl_url = api.file + "?id=" + fileid
  const extension = getExtension(filename)
  const fileType = getFileType(extension)

  if (window.location.hostname == coding_hostname) {
    //其它预览(参数改完，只需解决cors即可使用)
    switch (fileType) {
      case 'image':
        const loadImage = () => pushHtml(`<div class="image-wrapper"><img data-zoomable onload="progress.finish()" onerror="progress.finish()" alt="${filename}" style="width: 100%; height: auto; position: relative;" src="${data.msg.url}"></div>`, data.msg.url)
        loadImage()
        loadScript('https://cdn.jsdelivr.net/npm/medium-zoom/dist/medium-zoom.min.js', () => {
          zoom = mediumZoom('[data-zoomable]')
        })
        break
      case 'video':
        pushHtml(`<div id="dplayer"></div>`, data.msg.url, true, true)
        const loadDplayer = () => {
          loadScript('https://cdn.jsdelivr.net/npm/dplayer/dist/DPlayer.min.js', () => {
            const container = document.getElementById('dplayer')
            dp = new DPlayer({
              container: container,
              theme: theme,
              screenshot: true,
              // preload: 'none',
              playbackSpeed: [0.2, 0.5, 0.75, 1, 1.25, 1.5, 2, 3, 5, 10],
              video: {
                url: data.msg.url,
                type: extension == 'flv' ? 'flv' : 'auto',
              }
            })
            if (extension == 'flv' || extension == 'avi') {
              dp.notice(`\`${extension}\` video maybe not support.`)
            }
            progress.finish()
          })
        }
        if (extension == 'flv') {
          loadScript('https://cdn.jsdelivr.net/npm/flv.js/dist/flv.min.js', () => {
            loadDplayer()
          })
        } else {
          loadDplayer()
        }
        break
      case 'audio':
        pushHtml(`<div id="aplayer" class="aplayer"></div>`, data.msg.url, true, false, '.5rem .5rem')
        const loadAplayer = () => {
          loadScript('https://cdn.jsdelivr.net/npm/aplayer/dist/APlayer.min.js', async () => {
            const r = await fetch(`https://api.iwz.me/meting/api.php?server=netease&type=search&id=${filename.replace(/\.[^/.]+$/, '')}`)
            const search = await r.json()
            let pic = ''
            let lrc = ''
            for (const i of search) {
              const {
                title = '', author = ''
              } = i
              const title_match = new RegExp(title.replace(/[^0-9a-zA-Z一-鿋ぁ-ヶ가-힝]+/gi, '').slice(0, 2), 'gi').test(filename.replace(/[^0-9a-zA-Z一-鿋ぁ-ヶ가-힝]+/gi, ''))
              const author_match = new RegExp(author.replace(/[^0-9a-zA-Z一-鿋ぁ-ヶ가-힝]+/gi, '').slice(0, 2), 'gi').test(filename.replace(/[^0-9a-zA-Z一-鿋ぁ-ヶ가-힝]+/gi, ''))
              // console.log(title.replace(/[^0-9a-zA-Z一-鿋ぁ-ヶ가-힝]+/gi, '').slice(0, 2), '->', filename.replace(/[^0-9a-zA-Z一-鿋ぁ-ヶ가-힝]+/gi, ''))
              // console.log(author.replace(/[^0-9a-zA-Z一-鿋ぁ-ヶ가-힝]+/gi, '').slice(0, 2), '->', filename.replace(/[^0-9a-zA-Z一-鿋ぁ-ヶ가-힝]+/gi, ''))
              if (pic == '' && author_match) pic = i.pic
              if (title_match && author_match) {
                console.log(filename, '->', title, '|', author)
                pic = i.pic
                lrc = i.lrc
                break
              }
            }
            ap = new APlayer({
              container: document.getElementById('aplayer'),
              lrcType: lrc ? 3 : 0,
              audio: [{
                name: filename.replace(/\.[^/.]+$/, ''),
                url: data.msg.url,
                cover: pic || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
                lrc: lrc,
              }],
              theme: theme,
              loop: 'none',
              // preload: 'none',
            })
            progress.finish()
          })
        }
        loadStyle('https://cdn.jsdelivr.net/npm/aplayer/dist/APlayer.min.css', () => loadAplayer())
        break
      default:
        pushHtml(`<div class="markdown-body" style="margin-top: 0; letter-spacing: .5px;">
      <code>文件名: ${filename}</code><br>
      <code>文件类型：${fileType}</code><br>
      <code>文件路径: ${dl_url.toString()}</code><br>
      <code>永久下载链接(可分享): ${"https://api.xrzyun.top" + dl_url.toString()}</code><br>
      <p>抱歉，我们现在不支持预览 <code>${/\./.test(filename) ? '.' + extension : filename}</code> 文件。 你可以直接 <a data-raw="true" href="${data.msg.url}">下载</a> 该文件.</p>
      <p>本页面临时下载链接到期时间：<code>${exp_show}</code><br>
      距离到期还有${lefttime[0]}天${lefttime[1]}小时${lefttime[2]}分钟${lefttime[3]}秒.(刷新以查看实时剩余时间)</p></div>`, data.msg.url, true)
    }
  } else {
    pushHtml(`<div class="markdown-body" style="margin-top: 0; letter-spacing: .5px;">
    <code>文件名: ${filename}</code><br>
    <code>文件类型：${fileType}</code><br>
    <code>文件路径: ${dl_url.toString()}</code><br>
    <code>永久下载链接(可分享): ${"https://api.xrzyun.top" + dl_url.toString()}</code><br>
    <p>抱歉，我们现在不支持预览 <code>${/\./.test(filename) ? '.' + extension : filename}</code> 文件。 你可以直接 <a data-raw="true" href="${data.msg.url}">下载</a> 该文件.</p>
    <p>本页面临时下载链接到期时间：<code>${exp_show}</code><br>
    距离到期还有${lefttime[0]}天${lefttime[1]}小时${lefttime[2]}分钟${lefttime[3]}秒.(刷新以查看实时剩余时间)</p></div>`, data.msg.url, true)
  }
  progress.finish()
}

function index_load() {
  let list = ""
  if (index.msg.Parent == 404) ParentCode = 0
  else if (index.msg.Parent.Code) ParentCode = index.msg.Parent.Code
  let {
    Description
  } = index.msg
  Description = Description.toString()
  Description = Description.replace(/\\/g, '')
  if (typeJSONorTXT(Description) == false) list = `<div style="padding: 1rem 1rem;"><div class="markdown-body" style="margin-top: 0; letter-spacing: .5px;"><p>${Description}</p></div></div>`
  if (typeJSONorTXT(Description) == true) {
    Description = JSON.parse(Description)
    if (Description.textarea.top) list = `<div style="padding: 1rem 1rem;"><div class="markdown-body" style="margin-top: 0; letter-spacing: .5px;"><p>${Description.textarea.top}</p></div></div>`
    if (Description.textarea.bottom) var list_bottom_text = Description.textarea.bottom
  }
  if (index.msg.Type != "SUB_TASK") {
    for (item of index.msg.SubTasks) {
      const {
        Code,
        Name
      } = item
      list += `<div class="item">
        <i class="far fa-folder"></i>${Name}<div style="flex-grow: 1"></div>
        <a href="?code=${Code}" data-name="${Name}" data-type="folder">${Name}</a></div>`
    }
    for (item of index.msg.Files) {
      const {
        Name,
        Size,
        Url
      } = item
      list += `<div class="item">
        <i class="${getIconClass(Name)}"></i>${Name}<div style="flex-grow: 1"></div>
        <span class="size">${formatSize(Size)}</span>
        <a href="${Url}" data-name="${Name}" data-size="${Size}" data-type="file">${Name}</a></div>`
    }
  }
  if (index.msg.Type == "SUB_TASK") {
    for (item of index.msg.Files) {
      const {
        Name,
        Size,
        Url
      } = item
      list += `<div class="item">
        <i class="${getIconClass(Name)}"></i>${Name}<div style="flex-grow: 1"></div>
        <span class="size">${formatSize(Size)}</span>
        <a href="${Url}" data-name="${Name}" data-size="${Size}" data-type="file">${Name}</a></div>`
    }
  }
  if (list_bottom_text) list += `<div style="padding: 1rem 1rem;"><div class="markdown-body" style="margin-top: 0; letter-spacing: .5px;"><p>${list_bottom_text}</p></div></div>`
  const html = `<div style="min-width: 280px;">${list}</div>`
  console.log(list)
  document.getElementById('list').innerHTML = html
  setTimeout(() => {
    progress.finish();
  }, 500);
}

progress.start()

function reconf() {
  Cookies.remove("conf")
  conf()
}

(async function LoadBase() {
  if (!!Cookies.get("conf") == false) {
    await conf()
    LoadBase()
  } else if (!!Cookies.get("conf") == true) {
    //加载标题
    document.title = title
    document.getElementById("navbar_title").innerHTML = title
    //载入首页/文件夹
    if (code == 0) window.location = "/"
    else if (code && !!Cookies.get("conf") == true) list_load(code)
    //载入首页/文件
    if (!code) {
      if (!fileid) index_load()
      else if (fileid && !!Cookies.get("conf") == true) fileINFO_load(fileid)
    }
  }
}())