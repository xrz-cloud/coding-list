const fetch = require('node-fetch')
const token = '把这一串中文改为令牌，不要删引号'
const ProjectName = "把这一串中文改为项目名，不要删引号"
const api = "https://e.coding.net/open-api"

exports.getFile = async (id) => {
  id = Number(id)
  const data = { "Action": "DescribeIssueFileUrl", "ProjectName": ProjectName, "FileId": id }
  const res = await fetch(`${api}`, {
    body: JSON.stringify(data),
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      Authorization: `token ${token}`,
    },
  })
  if (res.ok) return await res.json()
  else console.error(res.statusText)
}

exports.getIssue = async (code) => {
  code = Number(code)
  const data = { "Action": "DescribeIssue", "ProjectName": ProjectName, "IssueCode": code }
  const res = await fetch(`${api}`, {
    body: JSON.stringify(data),
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      Authorization: `token ${token}`,
    },
  })
  if (res.ok) return await res.json()
  else console.error(res.statusText)
}

exports.allAPI = async (data) => {
  const res = await fetch(`${api}`, {
    body: `${data}`,
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      Authorization: `token ${token}`,
    },
  })
  if (res.ok) return await res.json()
  else console.error(res.statusText)
}
