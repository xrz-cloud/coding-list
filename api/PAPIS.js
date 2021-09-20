const {
  PublicAPIServer
} = require('./api')

async function handler(req, res) {
  if (req.method == "POST") {
    var {
      body,
      token_type,
      token
    } = JSON.parse(req.body)
  } else {
    var {
      body,
      token_type,
      token
    } = req.query
  }
  const root = {
    "status": 200,
    "RequestId": "",
    "msg": "欢迎访问 CODING 公共API请求服务。我们需要以下参数：请求内容(body)、鉴权方式(token_type)[token/Bearer]、token。"
  }
  if (!token_type) token_type = "Bearer"
  else if (token_type == "bearer") token_type = "Bearer"
  if (!body) {
    const no_param = root
    no_param["msg"] = "缺少body"
    res.send(no_param)
  } else if (!token) {
    const no_param = root
    no_param["msg"] = "缺少token"
    res.send(no_param)
  } else {
    let data
    if (req.method == "POST") {
      data = await PublicAPIServer({
        "body": body,
        "token_type": token_type,
        "token": token
      })
    } else {
      data = await PublicAPIServer({
        "body": decodeURIComponent(body),
        "token_type": token_type,
        "token": token
      })
      console.log({
        "body": decodeURIComponent(body),
        "token_type": token_type,
        "token": token
      })
    }
    const RequestId = data.Response.RequestId
    if (data.Response) {
      const info = root
      info["RequestId"] = RequestId
      info["msg"] = data
      res.send(info)
    } else {
      const not_found = root
      not_found["status"] = 404
      not_found["msg"]["en"] = "What's up?"
      not_found["msg"]["zh-cn"] = "出错了？"
      not_found["RequestId"] = RequestId
      res.send(not_found)
    }
  }
}

module.exports = handler