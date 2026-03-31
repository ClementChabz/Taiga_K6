import http from 'k6/http'

// ==============================
// HEADERS
// ==============================
function getDefaultHeaders() {
  return {
    'User-Agent': 'k6-test',
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
  }
}

function getAuthHeaders(token) {
  return {
    ...getDefaultHeaders(),
    Authorization: `Bearer ${token}`,
  }
}

// ==============================
// AUTH
// ==============================
export function login(baseUrl, username, password) {
  const res = http.post(
    `${baseUrl}/api/v1/auth`,
    JSON.stringify({
      username: username,
      password: password,
      type: 'normal',
    }),
    { headers: getDefaultHeaders(), tags: { name: 'login' } }
  )

  return {
    token: res.json('auth_token'),
  }
}

// Pas de logout officiel, on simule
export function logout(baseUrl, token) {
  return http.get(`${baseUrl}/api/v1/stats/discover`, {
    headers: { Authorization: `Bearer ${token}` },
    tags: { name: 'logout' },
  })
}

// ==============================
// PROJECT
// ==============================
export function getProjectId(baseUrl, token, slug) {
  const res = http.get(
    `${baseUrl}/api/v1/projects/by_slug?slug=${slug}`,
    {
      headers: getAuthHeaders(token),
      tags: { name: 'getProjectId' },
    }
  )

  return res.json('id')
}

// ==============================
// ISSUES
// ==============================
export function issuesList(baseUrl, token, projectId) {
  return http.get(
    `${baseUrl}/api/v1/issues?project=${projectId}`,
    {
      headers: getAuthHeaders(token),
      tags: { name: 'issuesList' },
    }
  )
}

export function searchIssue(baseUrl, token, projectId) {
  return http.get(
    `${baseUrl}/api/v1/issues?project=${projectId}&status__is_closed=false`,
    {
      headers: getAuthHeaders(token),
      tags: { name: 'searchIssue' },
    }
  )
}

export function createIssue(baseUrl, token, projectId) {
  const payload = JSON.stringify({
    subject: `Issue k6 ${Math.random()}`,
    description: 'Created by k6',
    project: projectId,
    type: 1,
    severity: 2,
    priority: 2,
  })

  const res = http.post(`${baseUrl}/api/v1/issues`, payload, {
    headers: getAuthHeaders(token),
    tags: { name: 'createIssue' },
  })

  return {
    issueId: res.json('id'),
    issueVersion: res.json('version'),
  }
}

export function updateIssue(baseUrl, token, projectId, issueId, version) {
  const payload = JSON.stringify({
    version: version,
    status: 2,
    priority: 3,
  })

  return http.patch(
    `${baseUrl}/api/v1/issues/${issueId}`,
    payload,
    {
      headers: getAuthHeaders(token),
      tags: { name: 'updateIssue' },
    }
  )
}

export function deleteIssue(baseUrl, token, projectId, issueId) {
  return http.del(
    `${baseUrl}/api/v1/issues/${issueId}`,
    null,
    {
      headers: getAuthHeaders(token),
      tags: { name: 'deleteIssue' },
    }
  )
}