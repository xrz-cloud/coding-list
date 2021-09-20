const T2J = require('@ltd/j-toml')
const J2T = require('json2toml')

async function handler(req, res) {
  let {
    action,
    o
  } = req.query
  const root = {
    "status": 200,
    "res": "",
    "msg": "欢迎使用TOML和JSON互转服务。"
  }
  let info = root
  if (!action || !o) info["res"] = "缺少关键值action或o。"
  else if (action == "T2J" && o) info["res"] = T2J.parse(o, 1.0, '\n')
  else if (action == "J2T" && o) info["res"] = J2T(o)
  res.send(info)
}

module.exports = handler