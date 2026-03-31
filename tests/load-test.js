import { sleep } from 'k6';
import { Trend } from 'k6/metrics';
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
// TRENDS (pour mesurer la durée par étape)
// ==============================
const loginTrend       = new Trend('login_duration');
const logoutTrend      = new Trend('logout_duration');
const getProjectTrend  = new Trend('getProjectId_duration');
const issuesListTrend  = new Trend('issuesList_duration');
const searchIssueTrend = new Trend('searchIssue_duration');
const createIssueTrend = new Trend('createIssue_duration');
const updateIssueTrend = new Trend('updateIssue_duration');
const deleteIssueTrend = new Trend('deleteIssue_duration');

// ==============================
// WRAPPER POUR MESURER LA DURÉE
// ==============================
function timed(fn, trend, ...args) {
  const start = new Date().getTime();
  const result = fn(...args);
  const duration = new Date().getTime() - start;
  trend.add(duration);
  return result;
}

// ==============================
// OPTIONS (répartition de charge)
// ==============================
export const options = {
  scenarios: {
    scenarioA: {
      executor: 'constant-vus',
      vus: 75,
      duration: '1m',
      exec: 'scenarioA',
    },
    scenarioB: {
      executor: 'constant-vus',
      vus: 15,
      duration: '1m',
      exec: 'scenarioB',
    },
    scenarioC: {
      executor: 'constant-vus',
      vus: 10,
      duration: '1m',
      exec: 'scenarioC',
    },
    scenarioD: {
      executor: 'constant-vus',
      vus: 10,
      duration: '1m',
      exec: 'scenarioD',
    },
  },

  thresholds: {
    http_req_failed:   ['rate<0.01'],
    http_req_duration: ['p(99)<3000'], 
  },
};

// ==============================
// SCÉNARIOS
// ==============================
export function scenarioA() {
  const { token } = timed(login, loginTrend, BASE_URL, USERNAME, PASSWORD);
  const projectId = timed(getProjectId, getProjectTrend, BASE_URL, token, PROJECT_SLUG);

  timed(issuesList, issuesListTrend, BASE_URL, token, projectId);
  sleep(1);

  timed(searchIssue, searchIssueTrend, BASE_URL, token, projectId);
  sleep(1);

  timed(logout, logoutTrend, BASE_URL, token);
}

export function scenarioB() {
  const { token } = timed(login, loginTrend, BASE_URL, USERNAME, PASSWORD);
  const projectId = timed(getProjectId, getProjectTrend, BASE_URL, token, PROJECT_SLUG);

  timed(issuesList, issuesListTrend, BASE_URL, token, projectId);
  sleep(1);

  timed(createIssue, createIssueTrend, BASE_URL, token, projectId);
  sleep(1);

  timed(logout, logoutTrend, BASE_URL, token);
}

export function scenarioC() {
  const { token } = timed(login, loginTrend, BASE_URL, USERNAME, PASSWORD);
  const projectId = timed(getProjectId, getProjectTrend, BASE_URL, token, PROJECT_SLUG);

  timed(issuesList, issuesListTrend, BASE_URL, token, projectId);

  const { issueId, issueVersion } = timed(createIssue, createIssueTrend, BASE_URL, token, projectId);
  timed(updateIssue, updateIssueTrend, BASE_URL, token, projectId, issueId, issueVersion);
  sleep(1);

  timed(logout, logoutTrend, BASE_URL, token);
}

export function scenarioD() {
  const { token } = timed(login, loginTrend, BASE_URL, USERNAME, PASSWORD);
  const projectId = timed(getProjectId, getProjectTrend, BASE_URL, token, PROJECT_SLUG);

  const { issueId } = timed(createIssue, createIssueTrend, BASE_URL, token, projectId);
  timed(searchIssue, searchIssueTrend, BASE_URL, token, projectId);
  sleep(1);

  timed(deleteIssue, deleteIssueTrend, BASE_URL, token, projectId, issueId);
  sleep(1);

  timed(logout, logoutTrend, BASE_URL, token);
}