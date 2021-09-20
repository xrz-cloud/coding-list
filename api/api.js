const fetch = require('node-fetch')
const coding_api = "https://e.coding.net/open-api"

exports.getFile = async (id) => {
  id = Number(id)
  const data = {
    "Action": "DescribeIssueFileUrl",
    "ProjectName": process.env.coding_ProjectName,
    "FileId": id
  }
  const res = await fetch(`${coding_api}`, {
    body: JSON.stringify(data),
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      Authorization: `token ${process.env.coding_token}`,
    },
  })
  if (res.ok) return await res.json()
  else console.error(res.statusText)
}

exports.getIssue = async (code) => {
  code = Number(code)
  const data = {
    "Action": "DescribeIssue",
    "ProjectName": process.env.coding_ProjectName,
    "IssueCode": code
  }
  const res = await fetch(`${coding_api}`, {
    body: JSON.stringify(data),
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      Authorization: `token ${process.env.coding_token}`,
    },
  })
  if (res.ok) return await res.json()
  else console.error(res.statusText)
}

exports.getConf = async () => {
  const data = {
    "Action": "DescribeWiki",
    "ProjectName": process.env.coding_ProjectName,
    "Iid": 2,
    "VersionId": -1
  }
  const res = await fetch(`${coding_api}`, {
    body: JSON.stringify(data),
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      Authorization: `token ${process.env.coding_token}`,
    },
  })
  if (res.ok) return await res.json()
  else console.error(res.statusText)
}

exports.oauth = async (data) => {
  const res = await fetch(`https://${data.team}.coding.net/api/oauth/access_token`, {
    body: `client_id=${data.data.client_id}&client_secret=${data.data.client_secret}&code=${data.data.code}&grant_type=${data.data.grant_type}`,
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
  })
  if (res.ok) return await res.json()
  else console.error(res.statusText)
}

exports.allAPI = async (data) => {
  const res = await fetch(`${coding_api}`, {
    body: `${data}`,
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      Authorization: `token ${process.env.coding_token}`,
    },
  })
  if (res.ok) return await res.json()
  else console.error(res.statusText)
}

exports.PublicAPIServer = async (data) => {
  const res = await fetch(`${coding_api}`, {
    body: `${data.body}`,
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      Authorization: `${data.token_type} ${data.token}`,
    },
  })
  if (res.ok) return await res.json()
  else console.error(res.statusText)
}