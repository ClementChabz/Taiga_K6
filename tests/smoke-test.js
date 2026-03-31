import { sleep } from 'k6';
import {
  login,
  logout,
  getProjectId,
  issuesList,
  searchIssue,
  createIssue,
  updateIssue,
  deleteIssue
} from '../modules/taiga.js';

// ==============================
// CONFIG
// ==============================
const config   = JSON.parse(open('../config.json'));
const env      = __ENV.TARGET_ENV || 'local';
const settings = config[env];

const BASE_URL     = settings.baseUrl;
const USERNAME     = settings.username;
const PASSWORD     = settings.password;
const PROJECT_SLUG = settings.projectSlug;

// ==============================
// OPTIONS (SMOKE TEST)
// ==============================
export const options = {
  vus: 1,
  iterations: 1,
  thresholds: {
    http_req_failed:   ['rate<0.01'],
    http_req_duration: ['p(99)<3000'],
  },
};

// ==============================
// TEST
// ==============================
export default function () {

  // 1. Login
  const { token } = login(BASE_URL, USERNAME, PASSWORD);

  // 2. Project ID
  const projectId = getProjectId(BASE_URL, token, PROJECT_SLUG);

  // 3. Issues list
  issuesList(BASE_URL, token, projectId);
  sleep(1);

  // 4. Search
  searchIssue(BASE_URL, token, projectId);
  sleep(1);

  // 5. Create
  const { issueId, issueVersion } = createIssue(BASE_URL, token, projectId);
  sleep(1);

  // 6. Update
  updateIssue(BASE_URL, token, projectId, issueId, issueVersion);
  sleep(1);

  // 7. Delete
  deleteIssue(BASE_URL, token, projectId, issueId);
  sleep(1);

  // 8. Logout
  logout(BASE_URL, token);
}