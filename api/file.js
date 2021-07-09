const { getFile } = require('./api')

async function handler(req, res) {
  let { w, id, prefix } = req.query
  const root = { "status": 200, "RequestId": "", "msg": { "en": "", "zh-cn": "", "url": "" } }

  if (!id) {
    const no_param = root
    no_param["msg"]["en"] = "Plz specify the <id> param. For example: https://your.app/?id=22187534"
    no_param["msg"]["zh-cn"] = "请传入<id>参数。示例：https://your.app/?id=22187534"
    res.send(no_param)
  } else {
    const data = await getFile(id)
    const RequestId = data.Response.RequestId
    if (data.Response.Url) {
      let Url = data["Response"]["Url"].slice(6)
      if (prefix != undefined) { Url = prefix + Url }
      if (w != "json") res.redirect(Url)
      if (w == "json") {
        const dl_info = root
        dl_info["RequestId"] = RequestId
        dl_info["msg"]["url"] = Url
        res.send(dl_info)
      }
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
