const { getIssue } = require('./api')

async function handler(req, res) {
  const { code } = req.query
  const root = { "status": 200, "RequestId": "", "msg": { "en": "", "zh-cn": "" } }

  if (!code) {
    const no_param = root
    no_param["msg"]["en"] = "Plz specify the <code> param. For example: https://your.app/?code=190"
    no_param["msg"]["zh-cn"] = "请传入<code>参数。示例：https://your.app/?code=190"
    res.send(no_param)
  } else {
    const data = await getIssue(code)
    const RequestId = data.Response.RequestId
    if (data.Response.Issue) {
      const { Type, Name, Description, Files, SubTasks, Parent } = data.Response.Issue
      const issue_info = root
      issue_info["msg"] = { "Type": "", "Name": "", "Description": "", "Files": [], "SubTasks": [], "Parent": {} }
      issue_info["RequestId"] = RequestId
      issue_info["msg"]["Name"] = Name
      issue_info["msg"]["Description"] = Description
      issue_info["msg"]["Type"] = Type
      issue_info["msg"]["Files"] = Files
      if (Type == "SUB_TASK") {
        issue_info["msg"]["Parent"] = Parent
        issue_info["msg"]["SubTasks"] = 404
      } else {
        issue_info["msg"]["SubTasks"] = SubTasks
        issue_info["msg"]["Parent"] = 404
      }
      res.send(issue_info)
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
