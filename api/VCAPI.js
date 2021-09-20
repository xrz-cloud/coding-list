const {
  getConf
} = require('./api')

async function handler(req, res) {
  const root = {
    "status": 200,
    "info": {
      "title": "",
      "PN": "",
      "conf": ""
    },
    "msg": "欢迎访问 Vercel 公共API请求服务。"
  }
  const info = root
  let conf = await getConf()
  console.log(conf)
  if (conf.Response.Data && !conf.Response.Error) conf = await conf["Response"]["Data"]["Content"]
  info["info"]["title"] = process.env.title
  info["info"]["PN"] = process.env.coding_ProjectName
  info["info"]["conf"] = conf
  res.send(info)
}

module.exports = handler