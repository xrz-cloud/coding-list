async function handler(req, res) {
  const root = {
    "status": 200,
    "info": {
      "title": ""
    },
    "msg": "欢迎访问 Vercel 公共API请求服务。"
  }
  const info = root
  info["info"]["title"] = process.env.title
  res.send(info)
}

module.exports = handler