let TBC = document.getElementById("TBC"),
  oauth = JSON.parse(new URLSearchParams(location.search).get("info") || sessionStorage.getItem("oauth"))

function typeJSONorTXT(str) {
  if (typeof str == 'string') {
    try {
      let obj = JSON.parse(str);
      return true;
    } catch (e) {
      //console.log('error：' + str + '!!!' + e);
      return false;
    }
  }
  console.log('It is not a string!')
}

function StringAs(string) {
  //此函数用于将一个JSON字符串转义
  //e.g. '{"a": "b"}' => '{\"a\":\"b\"}'
  //来源：https://blog.csdn.net/zhangxin09/article/details/6582173
  return '"' + string.replace(/(\\|\"|\n|\r|\t)/g, "\\$1") + '"';
}

function changeData(data, newKey, oldKey) {
  let str = JSON.stringify(data);
  let reg = new RegExp(oldKey, 'i');
  let newStr = str.replace(reg, newKey);
  return JSON.parse(newStr);
}

function tomlifyZ(data) {
  let str = tomlify.toToml(data)
  str = str.replace(new RegExp('"', 'g'), "'")
  str = str.replace(new RegExp('\n', 'g'), "\\n")
  return str
}

function LoadStep1() {
  window.location.hash = "#user-content-step1"
  TBC.innerHTML = `<h2 id="user-content-step1">第一步<small>新建子用户</small></h2>
  <p><strong>声明：</strong>此步骤作用仅为保证账号安全，可以<a onclick="LoadStep2()">跳过</a>。</p>
  <p>1. 打开<a href="https://console.cloud.tencent.com/cam/user/create?systemType=FastCreate&policyId=22701145"
      target="_blank">此链接</a>，
    登录(管理员账号)，并按照下图填写。<img src="/docs/img/3.png" alt="3.png" class="mdui-img-fluid mdui-img-rounded" width="50%"
      height="50%">
    2. 打开<a href="https://console.cloud.tencent.com/developer" target="_blank">腾讯云账号</a>,【基本信息】>【账号ID】,复制<code>账号ID</code><br>
    3. 接下来按照<a href="https://help.coding.net/docs/admin/member/cloud.html" target="_blank">此教程</a>继续导入操作。<br>
    记得关联用户组，保证由权限：访问令牌、应用授权。<br>
    4. 浏览器 <a href="https://baike.baidu.com/item/InPrivate%E6%B5%8F%E8%A7%88/5727666"
      target="_blank">隐私模式/InPrivate浏览</a>，打开<code>https://{你的团队域名}.coding.net/login</code><br>
    5. 用子账号登录，【腾讯云账号】>【腾讯云子账号】，按创建时信息填写。
    <img src="/docs/img/4.png" alt="4.png" class="mdui-img-fluid mdui-img-rounded" width="50%" height="50%">
    <img src="/docs/img/5.png" alt="5.png" class="mdui-img-fluid mdui-img-rounded" width="50%" height="50%"></p>
    <div class="mdui-bottom-nav mdui-bottom-nav-scroll-hide">
    <div class="mdui-row-xs-2">
    <div class="mdui-col">
      <button class="mdui-btn mdui-btn-block mdui-color-theme-accent mdui-ripple mdui-btn-raised" disabled>上一步</button>
    </div>
    <div class="mdui-col">
      <button class="mdui-btn mdui-btn-block mdui-color-theme-accent mdui-ripple mdui-btn-raised"
        onclick="LoadStep2()">下一步</button>
    </div>
    </div>
  </div>`
}

function LoadStep2() {
  window.location.hash = "#user-content-step2"
  TBC.innerHTML = `<h2 id="user-content-step2">第二步<small>Oauth2授权</small></h2>
  <span id="TBCS"><form name="input" action="#user-content-step2" method="get">
    CODING团队:  https://<input type="text" name="team">.coding.net
    <input type="submit" value="确认" class="mdui-btn mdui-btn-raised mdui-btn-dense mdui-color-theme-accent mdui-ripple">
  </form></span>
  <div class="mdui-bottom-nav mdui-bottom-nav-scroll-hide">
    <div class="mdui-row-xs-2">
      <div class="mdui-col">
        <button class="mdui-btn mdui-btn-block mdui-color-theme-accent mdui-ripple mdui-btn-raised"
          onclick="LoadStep1()">上一步</button>
        </div>
      <div class="mdui-col">
        <button class="mdui-btn mdui-btn-block mdui-color-theme-accent mdui-ripple mdui-btn-raised" disabled>下一步</button>
      </div>
    </div>
  </div>`
}

async function LoadStep3() {
  window.location.hash = "#user-content-step3"
  let userId = JSON.parse(localStorage.getItem("user"))["Id"]
  TBC.innerHTML = `<h2 id="user-content-step3">第三步<small>选择存储数据的项目</small></h2>
    <span id="TBCS"><div class="mdui-progress">
    <div class="mdui-progress-indeterminate"></div>
    </div></span>
    <div class="mdui-bottom-nav mdui-bottom-nav-scroll-hide">
      <div class="mdui-row-xs-2">
        <div class="mdui-col">
          <button class="mdui-btn mdui-btn-block mdui-color-theme-accent mdui-ripple mdui-btn-raised"
            onclick="LoadStep2()">上一步</button>
          </div>
        <div class="mdui-col">
          <button class="mdui-btn mdui-btn-block mdui-color-theme-accent mdui-ripple mdui-btn-raised" disabled>下一步</button>
        </div>
      </div>
    </div>`
  if (!!oauth && !(new URLSearchParams(location.search).get("action"))) {
    let DUP = await fetch(`/api/PAPIS?body={"Action": "DescribeUserProjects","userId": ${userId}}&token_type=${oauth.token_type}&token=${oauth.access_token}`),
      ProjectList = [],
      tmpProjectName, tmpDI
    DUP = await DUP.json()
    console.log(DUP)
    DUP = DUP.msg.Response.ProjectList
    for (var i = 0; i < DUP.length; i++) {
      tmpProjectName = DUP[i]["Name"]
      tmpDI = await fetch(`/api/PAPIS?body={"Action": "DescribeIssue","ProjectName": "${tmpProjectName}","IssueCode": 1}&token_type=${oauth.token_type}&token=${oauth.access_token}`)
      tmpDI = await tmpDI.json()
      tmpDI = tmpDI.msg.Response
      console.log(tmpDI)
      if (!tmpDI.Error && tmpDI.Issue && tmpDI.Issue.Name) {
        if (tmpDI.Issue.Name == "ClistConfig") ProjectList.push(DUP[i])
      }
    }
    console.log(ProjectList)
    if (ProjectList.length != 0) {
      let tbody = ""
      for (var i = 0; i < ProjectList.length; i++) {
        tbody += `<tr onclick="window.location.href='/init?Name=${ProjectList[i]["Name"]}#user-content-step4'">
          <td>${i+1}</td>
          <td>${ProjectList[i]["DisplayName"]}</td>
          <td>${ProjectList[i]["Name"]}</td>
          <td>${ProjectList[i]["Description"]}</td>
        </tr>`
      }
      document.getElementById("TBCS").innerHTML = `请选择你想要使用的项目，点击那个项目即可。<br>
      <div class="mdui-table-fluid"><table class="mdui-table mdui-table-hoverable">
      <thead><tr>
        <th>#</th>
        <th>项目名称</th>
        <th>项目标识</th>
        <th>描述</th>
      </tr></thead>
      <tbody>${tbody}</tbody>
      </table></div>`
    } else {
      document.getElementById("TBCS").innerHTML = `<p>貌似没有在找到满足条件的项目，是否同意新建一个。
      <form name="input" action="#user-content-step3" method="get">
        <div class="mdui-textfield">
          <label class="mdui-textfield-label">操作(新建项目)</label>
          <input name="action" class="mdui-textfield-input" value="CCP" readonly required/>
        </div>
        <div class="mdui-textfield mdui-textfield-floating-label">
          <label class="mdui-textfield-label">项目名称</label>
          <input name="DisplayName" class="mdui-textfield-input" required/>
          <div class="mdui-textfield-error">项目名称不能为空</div>
          <div class="mdui-textfield-helper">可以使用中英文、数字、空格组合</div>
        </div>
        <div class="mdui-textfield mdui-textfield-floating-label">
          <label class="mdui-textfield-label">项目标识</label>
          <input name="Name" class="mdui-textfield-input" required/>
          <div class="mdui-textfield-error">项目标识不能为空</div>
          <div class="mdui-textfield-helper">项目地址为：https://团队名称.coding.net/p/项目标识</div>
        </div>
        项目描述采用默认，封面默认随机。若需更改，请创建完毕后自行至你的CODING更改。<br>
        <input type="submit" value="创建" class="mdui-btn mdui-btn-raised mdui-btn-dense mdui-color-theme-accent mdui-ripple">
      </form></p>`
    }
  } else if (!!oauth == false) {
    LoadStep2()
  }
}

function LoadStep4() {
  window.location.hash = "#user-content-step4"
  TBC.innerHTML = `<h2 id="user-content-step4">第四步<small>基础信息获取</small></h2>
    <span id="TBCS"><div class="mdui-progress">
    <div class="mdui-progress-indeterminate"></div>
    </div></span>
    <div class="mdui-bottom-nav mdui-bottom-nav-scroll-hide">
      <div class="mdui-row-xs-2">
        <div class="mdui-col">
          <button class="mdui-btn mdui-btn-block mdui-color-theme-accent mdui-ripple mdui-btn-raised"
            onclick="LoadStep3()">上一步</button>
          </div>
        <div class="mdui-col">
          <button class="mdui-btn mdui-btn-block mdui-color-theme-accent mdui-ripple mdui-btn-raised" disabled>下一步</button>
        </div>
      </div>
    </div>`
  document.getElementById("TBCS").innerHTML = `<form name="input" onsubmit="InStep4();return false;">
  用子账户(如果在第一步创建了的话，可以用主账户)打开<a href="https://${localStorage.getItem('team')}.coding.net/user/account/setting/tokens/new" target="_blank">此链接</a>，新建一个TOKEN。<br>
  提示：令牌描述可以随便填。建议权限勾选<code>project:file</code>,<code>project:issue</code>以保证以后继续可用，但现在全不勾选的权限也够用了（玄学，所以这里的精细权限设置只能靠新建子用户了）。<br>
  请复制创建的TOKEN并填入下框。<br>
  <div class="mdui-textfield mdui-textfield-floating-label">
    <label class="mdui-textfield-label">CODING TOKEN</label>
    <input id="coding_token" class="mdui-textfield-input" required/>
    <div class="mdui-textfield-error">CODING TOKEN 不能为空</div>
  </div>
  <div class="mdui-textfield mdui-textfield-floating-label">
    <label class="mdui-textfield-label">网站标题</label>
    <input id="title" class="mdui-textfield-input" value="xxx的文件分享" required/>
    <div class="mdui-textfield-error">网站标题不能为空</div>
  </div>
  <input type="submit" value="确认" class="mdui-btn mdui-btn-raised mdui-btn-dense mdui-color-theme-accent mdui-ripple">
  </form>`
}

async function InStep4(action = "GP", id = undefined) {
  let coding_token, title
  if (document.getElementById("coding_token") && document.getElementById("title")) {
    coding_token = document.getElementById("coding_token").value
    title = document.getElementById("title").value
    localStorage.setItem("coding_token", coding_token)
    localStorage.setItem("title", title)
  } else {
    coding_token = localStorage.getItem("coding_token") || document.getElementById("coding_token").value
    title = localStorage.getItem("title") || document.getElementById("title").value
  }
  LoadStep5()
  return false
}

function LoadStep5() {
  window.location.hash = "#user-content-step5"
  TBC.innerHTML = `<h2 id="user-content-step5">第五步<small>创建首页</small></h2>
  <div class="mdui-textfield mdui-textfield-floating-label">
    <label class="mdui-textfield-label">顶部消息/公告</label>
    <input id="des_top" class="mdui-textfield-input"/>
  </div>
  <div class="mdui-divider"></div>首页文件夹显示
  <div class="mdui-table-fluid"><table class="mdui-table mdui-table-hoverable">
    <thead><tr>
      <th>#</th>
      <th mdui-tooltip="{'content': '即IssueCode，应为除了0之外的数字，否则保存时会被清空。'}">指向事项Code</th>
      <th mdui-tooltip="{'content': '即文件夹名称，用于表明文件夹/事项的作用。'}">列表显示名称</th>
      <th>操作</th>
    </tr></thead>
    <tbody id="TBCS"></tbody>
  </table></div>
  <button class="mdui-btn mdui-btn-raised mdui-btn-dense mdui-color-theme-accent mdui-ripple" onclick="InStep5_add()">新增</button>
  <button class="mdui-btn mdui-btn-raised mdui-btn-dense mdui-color-theme-accent mdui-ripple" onclick="InStep5_clear()">清空</button><br><br>
  <div class="mdui-divider"></div>
  <div class="mdui-textfield mdui-textfield-floating-label">
    <label class="mdui-textfield-label">底部消息</label>
    <input id="des_bottom" class="mdui-textfield-input"/>
  </div>
  <button class="mdui-btn mdui-btn-raised mdui-btn-dense mdui-color-theme-accent mdui-ripple" onclick="InStep5_done()">保存并继续</button>
    <h3>帮助</h3>
    如何查找Code(IssueCode)：查看下图，图上的<code>IssueCode</code>是<code>82</code>。<br>
    <img src="/docs/img/8.png" alt="8.png" class="mdui-img-fluid mdui-img-rounded" width="50%" height="50%"><br>
    各种值的含义：<br>
    <img src="/docs/img/10.png" alt="10.png" class="mdui-img-fluid mdui-img-rounded" width="50%" height="50%"><br>
    <div class="mdui-bottom-nav mdui-bottom-nav-scroll-hide">
      <div class="mdui-row-xs-2">
        <div class="mdui-col">
          <button class="mdui-btn mdui-btn-block mdui-color-theme-accent mdui-ripple mdui-btn-raised"
            onclick="LoadStep4()">上一步</button>
          </div>
        <div class="mdui-col">
          <button class="mdui-btn mdui-btn-block mdui-color-theme-accent mdui-ripple mdui-btn-raised" disabled>下一步</button>
        </div>
      </div>
    </div>`
  let desktop = JSON.parse(localStorage.getItem("desktop")) || []
  localStorage.setItem("desktop", JSON.stringify(desktop))
  InStep5_gen()
}

function InStep5_gen() {
  let desktop = JSON.parse(localStorage.getItem("desktop")) || [],
    list = ""
  for (let i = 0; i < desktop.length; i++) {
    list += `<tr>
    <td>${i+1}</td>
    <td><input class="mdui-textfield-input" type="text" id="dt-code-${i}" value="${desktop[i].Code || ""}" placeholder="点击我即可修改Code,为除0以外的数字"/></td>
    <td><input class="mdui-textfield-input" type="text" id="dt-name-${i}" value="${desktop[i].Name || ""}" placeholder="点击我即可修改Name"/></td>
    <td><button class="mdui-btn mdui-btn-raised mdui-btn-dense mdui-color-theme-accent mdui-ripple" onclick="InStep5_remove(${i})">删除</button></td></tr>`
  }
  document.getElementById("TBCS").innerHTML = list
}

function InStep5_save() {
  let desktop = JSON.parse(localStorage.getItem("desktop")) || []
  for (let i = 0; i < desktop.length; i++) {
    desktop[i]["Code"] = Number(document.getElementById(`dt-code-${i}`).value)
    desktop[i]["Name"] = document.getElementById(`dt-name-${i}`).value
    desktop[i]["Type"] = "SUB_TASK"
  }
  localStorage.setItem("desktop", JSON.stringify(desktop))
}

function InStep5_add() {
  InStep5_save()
  let desktop = JSON.parse(localStorage.getItem("desktop")) || []
  desktop.push({})
  localStorage.setItem("desktop", JSON.stringify(desktop))
  InStep5_gen()
}

function InStep5_remove(ele) {
  let desktop = JSON.parse(localStorage.getItem("desktop")) || []
  desktop.splice(ele, 1)
  localStorage.setItem("desktop", JSON.stringify(desktop))
  InStep5_save()
  InStep5_gen()
}

function InStep5_clear() {
  localStorage.removeItem("desktop")
  location.reload()
}

async function InStep5_done() {
  InStep5_save()
  let desktop = JSON.parse(localStorage.getItem("desktop")) || [],
    des_top = document.getElementById("des_top").value,
    des_bottom = document.getElementById("des_bottom").value,
    index = {
      "status": 200,
      "RequestId": "null",
      "msg": {
        "Type": "MISSION",
        "Name": "INDEX",
        "Description": {
          "textarea": {
            "top": des_top,
            "bottom": des_bottom
          }
        },
        "Files": [],
        "SubTasks": desktop,
        "Parent": 404
      }
    },
    ClistConfig = encodeURIComponent(tomlifyZ({
      "index": index,
      "title": localStorage.getItem("title"),
      "refresh": `${1*60*60*1000}`,
      "share": {
        "github_repo": "https://github.com/xrz-cloud/coding-list"
      }
    })) //重要提示：此处Description直接以json转toml储存，故获取信息后需手动转换为字符串形式json
  let MW = await fetch(`/api/PAPIS?body={"Action": "ModifyWiki","ProjectName": "${new URLSearchParams(location.search).get("Name")}","Title": "ClistConfig","Content": "${ClistConfig}","Iid": 2,"Msg": "创建了首页、标题、刷新时间。可以按照格式修改，参照coding-list项目文档。"}&token_type=${oauth.token_type}&token=${oauth.access_token}`)
  MW = await MW.json()
  MW = MW.msg.Response
  if (!MW.Error && MW.Data) {
    LoadStep6()
  } else {
    document.getElementById("TBCS").innerHTML = `好像出了些奇怪的问题呢？<br>
    按下<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>I</kbd>或<kbd>Fn</kbd>+<kbd>F12</kbd>打开 开发者工具=>控制台 查看日志<br>
    推测是token失效。`
  }
}

async function LoadStep6() {
  let VCV = await fetch("/api/VCAPI") 
  VCV = await VCV.json()
  title = VCV.info.title
  PN = VCV.info.PN
  window.location.hash = "#user-content-step6"
  TBC.innerHTML = `<h2 id="user-content-step6">第六步<small>完成&帮助</small></h2>
  <p>恭喜，到目前为止，所有基础配置已完成，本程序已经可以使用。<a href="/">点我前往首页</a><br>
  你可以在CodingList项目中找到WIKI的#2，并按照帮助对其进行配置的修改。(我们使用 TOML v0.4.0 作为配置文件，<a href="https://toml.io/cn/v0.4.0" target="_blank">语法参考</a>)<br>
  也可以在本程序的管理界面进行图形化管理。<br>
  重要检测：<code>${title}</code>是否是你的网站名;<code>${PN}</code>是否是你的CODING项目名。<br>
  如果不是，请尝试到Vercel重新部署此项目。否则，会导致网站无法正常使用（包括子项目文件无法加载等）</p>
    <div class="mdui-bottom-nav mdui-bottom-nav-scroll-hide">
      <div class="mdui-row-xs-2">
        <div class="mdui-col">
          <button class="mdui-btn mdui-btn-block mdui-color-theme-accent mdui-ripple mdui-btn-raised"
            onclick="LoadStep5()">上一步</button>
          </div>
      </div>
    </div>`
}

if (window.location.hash == "") window.location.hash = "#user-content-step1"
if (window.location.hash == "#user-content-step1") LoadStep1()
if (window.location.hash == "#user-content-step2") {
  LoadStep2()
  if (new URLSearchParams(location.search).get("team")) {
    document.getElementById("TBCS").innerHTML = `<p>1. 打开<a href="https://${new URLSearchParams(location.search).get("team")}.coding.net/oauth_authorize.html?your-team=xco&client_id=bac91b6b365dea96b0b649611a6ef4fd&redirect_uri=https://api.xrzyun.top/coding/oauth/callback&response_type=code&scope=user,user:email,project,project:depot" target="_blank">此链接</a>。<br>
    2. 按要求授权。<br>
    3. 复制授权后跳转到的网页得到的json，并填入下框。<br>
    <form name="input" action="#user-content-step2" method="get">
    <div class="mdui-textfield mdui-textfield-floating-label">
      <label class="mdui-textfield-label">授权信息</label>
      <input name="info" class="mdui-textfield-input" pattern="(\\{|\\[)+(\\s|\\w+)[^>]*(\\}|\\])+" required/>
      <div class="mdui-textfield-error">请输入不为空的JSON</div>
      <div class="mdui-textfield-helper">提示：1. 授权信息不能为空 ; 2. 授权信息是JSON</div>
    </div>
    <input type="submit" value="确认" class="mdui-btn mdui-btn-raised mdui-btn-dense mdui-color-theme-accent mdui-ripple">
    </form>
    Example：<pre>{
      "access_token": "xxxxxxa1x6584xxxxx8e4a25c3578xxx",
      "refresh_token": "xxxxxx39x6048xxxxxcaa88ecadexxx",
      "team": "xco",
      "token_type": "bearer",
      "expires_in": "784853"
}</pre></p>`
  }
  if (!!oauth) {
    TBC.innerHTML = `<h2 id="user-content-step2">第二步<small>Oauth2授权</small></h2>
    <span id="TBCS"><div class="mdui-progress">
    <div class="mdui-progress-indeterminate"></div>
    </div></span>
    <div class="mdui-bottom-nav mdui-bottom-nav-scroll-hide">
      <div class="mdui-row-xs-2">
        <div class="mdui-col">
          <button class="mdui-btn mdui-btn-block mdui-color-theme-accent mdui-ripple mdui-btn-raised"
            onclick="LoadStep1()">上一步</button>
          </div>
        <div class="mdui-col">
          <button class="mdui-btn mdui-btn-block mdui-color-theme-accent mdui-ripple mdui-btn-raised"
            onclick="LoadStep3()">下一步</button>
        </div>
      </div>
    </div>`
    async function DCCU() {
      let DCCU = await fetch(`/api/PAPIS?body={"Action": "DescribeCodingCurrentUser"}&token_type=${oauth.token_type}&token=${oauth.access_token}`)
      DCCU = await DCCU.json()
      if (DCCU.msg.Response.User) {
        document.getElementById("TBCS").innerHTML = `<p><strong>这些是你的信息</strong><small>API测试</small>
        <div class="mdui-card">
        <div class="mdui-card-header">
        <img class="mdui-card-header-avatar" src="${DCCU.msg.Response.User.Avatar}"/>
        <div class="mdui-card-header-title">${DCCU.msg.Response.User.Name}</div>
        <div class="mdui-card-header-subtitle">${DCCU.msg.Response.User.NamePinYin}</div>
        </div></div>
        地区：${DCCU.msg.Response.User.Region}<br>
        邮箱：${DCCU.msg.Response.User.Email}<br>
        手机：${DCCU.msg.Response.User.PhoneRegionCode} ${DCCU.msg.Response.User.Phone}<br>
        获取到的信息一览：<pre>${JSON.stringify(DCCU,null,2)}</pre></p>`
        sessionStorage.setItem("oauth", JSON.stringify(oauth))
        localStorage.setItem("user", JSON.stringify(DCCU.msg.Response.User))
        localStorage.setItem("team", oauth.team)
      } else {
        console.warn("API测试返回数据", DCCU)
        sessionStorage.removeItem("oauth")
        document.getElementById("TBCS").innerHTML = `好像出了些奇怪的问题呢？<br>
        按下<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>I</kbd>或<kbd>Fn</kbd>+<kbd>F12</kbd>打开 开发者工具=>控制台 查看日志<br>
        推测是token失效，以为您清除保存的token信息，请刷新本页面重试。`
      }
    }
    DCCU()
  }
}

if (window.location.hash == "#user-content-step3" && !!oauth) {
  LoadStep3()
  if (new URLSearchParams(location.search).get("action") == "CCP" && new URLSearchParams(location.search).get("Name") && new URLSearchParams(location.search).get("DisplayName")) {
    async function CCP() {
      let CCP = await fetch(`/api/PAPIS?body={"Action": "CreateCodingProject","Name": "${new URLSearchParams(location.search).get("Name")}", "DisplayName": "${new URLSearchParams(location.search).get("DisplayName")}","GitReadmeEnabled": true,"VcsType": "git","CreateSvnLayout": false,"Shared": 0,"ProjectTemplate": "DEV_OPS","Description": "本项目是clist调用项目。请勿删除项目协同中Code为1的事项，此事项用于标记项目是否作为clist，并存储clist配置。(此描述由clist自动生成)"}&token_type=${oauth.token_type}&token=${oauth.access_token}`)
      CCP = await CCP.json()
      CCP = CCP.msg.Response
      if (!CCP.Error && CCP.ProjectId) {
        document.getElementById("TBCS").innerHTML = `<p>项目新建完成，项目ID为<code>${CCP.ProjectId}</code>。<br>
        点击<a href="https://${localStorage.getItem('team')}.coding.net/p/${new URLSearchParams(location.search).get('Name')}/setting" target="_blank">此链接</a>在CODING进行你想要的修改。<br>
        例如：封面。<br>
        <strong>提示：</strong><ins>如果需要重新配置程序，请从头开始初始化。不在此初始化可能导致程序出错。</ins><br>
        <div class="mdui-divider"></div>
        在点击按钮前，请先打开<a href="https://${localStorage.getItem('team')}.coding.net/p/${new URLSearchParams(location.search).get('Name')}/pm-initialize" target="_blank" class="mdui-btn mdui-color-theme-accent mdui-ripple mdui-btn-raised">此链接</a>，并按照图片初始化。<br>
        <img src="/docs/img/9.png" alt="9.png" class="mdui-img-fluid mdui-img-rounded" width="50%" height="50%"><br>
        <a href="/init?action=CIinit&Name=${new URLSearchParams(location.search).get("Name")}#user-content-step3" class="mdui-btn mdui-btn-block mdui-color-theme-accent mdui-ripple mdui-btn-raised">开始程序配置</a></p>`
      }
    }
    CCP()
  } else if (new URLSearchParams(location.search).get("action") == "CIinit" && new URLSearchParams(location.search).get("Name")) {
    async function CIinit() {
      let CIinit = await fetch(`/api/PAPIS?body={"Action": "CreateIssue","ProjectName": "${new URLSearchParams(location.search).get("Name")}","Type": "MISSION","Name": "ClistConfig","Priority": "3","Description": "修改配置请查看WIKI的%232"}&token_type=${oauth.token_type}&token=${oauth.access_token}`)
      CIinit = await CIinit.json()
      CIinit = CIinit.msg.Response
      if (!CIinit.Error && CIinit.Issue) {
        let CW = await fetch(`/api/PAPIS?body={"Action": "CreateWiki","ProjectName": "${new URLSearchParams(location.search).get("Name")}","Title": "ClistConfig","Content": "${tomlifyZ({'test': '测试'})}","ParentIid": 0,"Msg": "初始化"}&token_type=${oauth.token_type}&token=${oauth.access_token}`)
        CW = await CW.json()
        CW = CW.msg.Response
        if (!CW.Error && CW.Data) {
          TBC.innerHTML = `<h2 id="user-content-step3">第三步<small>选择存储数据的项目</small></h2>
            <span id="TBCS"><div class="mdui-progress">
            <div class="mdui-progress-indeterminate"></div>
            </div></span>
            <div class="mdui-bottom-nav mdui-bottom-nav-scroll-hide">
              <div class="mdui-row-xs-2">
                <div class="mdui-col">
                  <button class="mdui-btn mdui-btn-block mdui-color-theme-accent mdui-ripple mdui-btn-raised"
                    onclick="LoadStep2()">上一步</button>
              </div>
              <div class="mdui-col">
                  <button class="mdui-btn mdui-btn-block mdui-color-theme-accent mdui-ripple mdui-btn-raised"
                    onclick="window.location.href='/init?Name=${new URLSearchParams(location.search).get("Name")}#user-content-step4'">下一步</button>
              </div>
            </div>
            </div>`
          document.getElementById("TBCS").innerHTML = `<p>我们在你新建的项目中创建了一个叫<code>ClistConfig</code>事项。(此事项应为#1，用于标记此项目为clist)<br>
          并且，我们在你的项目中创建了为#2的WIKI，这个WIKI用来存放配置文件。<br>
          请确认<a href="https://${localStorage.getItem('team')}.coding.net/p/${new URLSearchParams(location.search).get('Name')}/wiki/2" target="_blank">此链接</a>中，显示了以下文字：<br>
          test = '测试'<br>
          请点击下一步以继续。</p>`
        } else {
          document.getElementById("TBCS").innerHTML = `好像出了些奇怪的问题呢？<br>
          按下<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>I</kbd>或<kbd>Fn</kbd>+<kbd>F12</kbd>打开 开发者工具=>控制台 查看日志`
        }
      } else {
        document.getElementById("TBCS").innerHTML = `好像出了些奇怪的问题呢？<br>
        按下<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>I</kbd>或<kbd>Fn</kbd>+<kbd>F12</kbd>打开 开发者工具=>控制台 查看日志
        <div class="mdui-divider"></div>
        您可能没有在点击按钮前进行初始化，请先打开<a href="https://${localStorage.getItem('team')}.coding.net/p/${new URLSearchParams(location.search).get('ProjectName')}/pm-initialize" target="_blank">此链接</a>，并按照图片初始化。<br>
        <img src="/docs/img/9.png" alt="9.png" class="mdui-img-fluid mdui-img-rounded" width="50%" height="50%"><br>
        <a onclick="location.reload()" class="mdui-btn mdui-btn-block mdui-color-theme-accent mdui-ripple mdui-btn-raised">重新开始程序配置(刷新本页)</a>`
      }
    }
    CIinit()
  }
}

if (window.location.hash == "#user-content-step4" && !!oauth) LoadStep4()

if (window.location.hash == "#user-content-step5" && !!oauth) LoadStep5()

if (window.location.hash == "#user-content-step6") LoadStep6()

mdui.mutation()