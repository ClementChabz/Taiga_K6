import { check, group } from 'k6'
import http from 'k6/http'

const config = JSON.parse(open('../config.json'));
const env = __ENV.TARGET_ENV || 'local'; // Default to local
const settings = config[env];
console.log(`Running tests against environment: ${env}`);
console.log(`Host: ${settings}`);
const HOST = settings.host;
const BASE_URL = settings.baseUrl;
const USERNAME = settings.username;
const PASSWORD = settings.password;


// random sleep between 500ms and 2000ms (0.5s to 2s):
const getThinkTime = () => Math.random() * (2 - 0.5) + 0.5;
const today = new Date().toISOString().split('T')[0];
const timestamp = new Date(Date.now() + 60*60*1000);        // +1h en ms
const time_fr = timestamp.toISOString().split('T')[1].slice(0, 5);
const empId = Math.floor(Math.random() * 100000 + 100000);

export function login() {
  let response
  group('01 - Login - /auth/login', function () {
    response = http.get(BASE_URL, {
      headers: {
        Host: HOST,
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        Connection: 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
      },
    });
    check(response, {
    '01-status 200': (r) => r.status === 200,
    });
    const csrfMatch = response.body.match(/:token="&quot;(.*)&quot;/);
    const token = csrfMatch ? csrfMatch[1] : null;
    console.log ("Token   ", token);
    response = http.get(`${BASE_URL}/web/index.php/auth/login`, {
      headers: {
        Host: HOST,
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        Connection: 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
      },
    });
    response = http.get(
      `${BASE_URL}/web/index.php/core/i18n/messages`,
      {
        headers: {
          Host: HOST,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
          Accept: 'application/json',
          'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          contentType: 'application/json',
          'If-None-Match': '"udPzp5tmK1qJ8SD5ih5TmI9iNvVEpV1lqd0luA2ddBE="',
          Connection: 'keep-alive',
          Referer: `${BASE_URL}/web/index.php/auth/login`,
        },
      }
    );
    response = http.post(
      `${BASE_URL}/web/index.php/auth/validate`,
      {
        _token: token,
        username: USERNAME,
        password: PASSWORD,
      },
      {
        headers: {
          Host: HOST,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          'Content-Type': 'application/x-www-form-urlencoded',
          Origin: `${BASE_URL}`,
          Connection: 'keep-alive',
          Referer: `${BASE_URL}/web/index.php/auth/login`,
        },
      }
    );
    check(response, {
    'Validate login status 200': (r) => r.status === 200,
    });
    response = http.get(`${BASE_URL}/web/index.php/dashboard/index`, {
      headers: {
        Host: HOST,
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        Referer: `${BASE_URL}/web/index.php/auth/login`,
        Connection: 'keep-alive',
      },
    });
    check(response, {
    '03 status 200': (r) => r.status === 200,
    });
    response = http.get(
      `${BASE_URL}/web/index.php/core/i18n/messages`,
      {
        headers: {
          Host: HOST,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
          Accept: 'application/json',
          'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          contentType: 'application/json',
          'If-None-Match': '"udPzp5tmK1qJ8SD5ih5TmI9iNvVEpV1lqd0luA2ddBE="',
          Connection: 'keep-alive',
          Referer: `${BASE_URL}/web/index.php/dashboard/index`,
        },
      }
    );
    response = http.get(
      `${BASE_URL}/web/index.php/api/v2/dashboard/employees/time-at-work?timezoneOffset=1&currentDate=${today}&currentTime=${time_fr}`,
      {
        headers: {
          Host: HOST,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
          Accept: 'application/json',
          'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          'Cache-Control': 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0',
          Connection: 'keep-alive',
          Referer: `${BASE_URL}/web/index.php/dashboard/index`,
        },
      }
    );
    response = http.get(
      `${BASE_URL}/web/index.php/api/v2/dashboard/employees/action-summary`,
      {
        headers: {
          Host: HOST,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
          Accept: 'application/json',
          'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          'Cache-Control': 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0',
          Connection: 'keep-alive',
          Referer: `${BASE_URL}/web/index.php/dashboard/index`,
        },
      }
    );
    response = http.get(
      `${BASE_URL}/web/index.php/api/v2/dashboard/shortcuts`,
      {
        headers: {
          Host: HOST,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
          Accept: 'application/json',
          'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          'Cache-Control': 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0',
          Connection: 'keep-alive',
          Referer: `${BASE_URL}/web/index.php/dashboard/index`,
        },
      }
    );
    response = http.get(
      `${BASE_URL}/web/index.php/api/v2/buzz/feed?limit=5&offset=0&sortOrder=DESC&sortField=share.createdAtUtc`,
      {
        headers: {
          Host: HOST,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
          Accept: 'application/json, text/plain, */*',
          'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          Connection: 'keep-alive',
          Referer: `${BASE_URL}/web/index.php/dashboard/index`,
        },
      }
    );
    console.log ("04 status : ", response.status);
    check(response, {
    '04 status 200': (r) => r.status === 200,
    });
    response = http.get(
      `${BASE_URL}/web/index.php/api/v2/dashboard/employees/leaves?date=2026-03-17`,
      {
        headers: {
          Host: HOST,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
          Accept: 'application/json',
          'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          'Cache-Control': 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0',
          Connection: 'keep-alive',
          Referer: `${BASE_URL}/web/index.php/dashboard/index`,
        },
      }
    );
    check(response, {
    '05 status 200': (r) => r.status === 200,
    });
    response = http.get(
      `${BASE_URL}/web/index.php/api/v2/dashboard/employees/subunit`,
      {
        headers: {
          Host: HOST,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
          Accept: 'application/json',
          'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          'Cache-Control': 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0',
          Connection: 'keep-alive',
          Referer: `${BASE_URL}/web/index.php/dashboard/index`,
        },
      }
    );
    check(response, {
    '06 status 200': (r) => r.status === 200,
    });
    response = http.get(
      `${BASE_URL}/web/index.php/api/v2/dashboard/employees/locations`,
      {
        headers: {
          Host: HOST,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
          Accept: 'application/json',
          'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          'Cache-Control': 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0',
          Connection: 'keep-alive',
          Referer: `${BASE_URL}/web/index.php/dashboard/index`,
        },
      }
    );
    // console.log ("locations : ", response.json());
    check(response, {
      'status 200':        (r) => r.status === 200,
      'has data array':    (r) => r.json('data') !== null,
      'first name exists': (r) => r.json('data.0.location.name') !== '',
    });
    response = http.post(
      `${BASE_URL}/web/index.php/events/push`,
      null,
      {
        headers: {
          Host: HOST,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
          Accept: 'application/json',
          'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          Origin: `${BASE_URL}`,
          Connection: 'keep-alive',
          Referer: `${BASE_URL}/web/index.php/dashboard/index`,
        },
      }
    );
    check(response, {
    'Push events status 200': (r) => r.status === 200,
    });

    response = http.get(
      `${BASE_URL}/web/index.php/pim/viewPhoto/empNumber/22`,
      {
        headers: {
          Host: HOST,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
          Accept: 'image/avif,image/webp,image/png,image/svg+xml,image/*;q=0.8,*/*;q=0.5',
          'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          Connection: 'keep-alive',
          Referer: `${BASE_URL}/web/index.php/dashboard/index`,
        },
      }
    );
    response = http.get(
      `${BASE_URL}/web/index.php/pim/viewPhoto/empNumber/11`,
      {
        headers: {
          Host: HOST,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
          Accept: 'image/avif,image/webp,image/png,image/svg+xml,image/*;q=0.8,*/*;q=0.5',
          'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          Connection: 'keep-alive',
          Referer: `${BASE_URL}/web/index.php/dashboard/index`,
        },
      }
    );
    response = http.get(`${BASE_URL}/web/index.php/buzz/photo/9`, {
      headers: {
        Host: HOST,
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
        Accept: 'image/avif,image/webp,image/png,image/svg+xml,image/*;q=0.8,*/*;q=0.5',
        'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        Connection: 'keep-alive',
        Referer: `${BASE_URL}/web/index.php/dashboard/index`,
      },
    });
    response = http.get(
      `${BASE_URL}/web/index.php/pim/viewPhoto/empNumber/9`,
      {
        headers: {
          Host: HOST,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
          Accept: 'image/avif,image/webp,image/png,image/svg+xml,image/*;q=0.8,*/*;q=0.5',
          'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          Connection: 'keep-alive',
          Referer: `${BASE_URL}/web/index.php/dashboard/index`,
        },
      }
    );
  });
}
export function viewPimModule() {
  let response
  group('01-PIM - /pim/viewPimModule', function () {
    response = http.get(
      `${BASE_URL}/web/index.php/pim/viewPimModule`,
      {
        headers: {
          Host: HOST,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          Connection: 'keep-alive',
          Referer: `${BASE_URL}/web/index.php/dashboard/index`,
        },
      }
    )
    response = http.get(
      `${BASE_URL}/web/index.php/pim/viewEmployeeList`,
      {
        headers: {
          Host: HOST,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          Referer: `${BASE_URL}/web/index.php/dashboard/index`,
          Connection: 'keep-alive',
        },
      }
    )
    response = http.get(
      `${BASE_URL}/web/index.php/core/i18n/messages`,
      {
        headers: {
          Host: HOST,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
          Accept: 'application/json',
          'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          contentType: 'application/json',
          'If-None-Match': '"udPzp5tmK1qJ8SD5ih5TmI9iNvVEpV1lqd0luA2ddBE="',
          Connection: 'keep-alive',
          Referer: `${BASE_URL}/web/index.php/pim/viewEmployeeList`,
        },
      }
    )
    response = http.get(
      `${BASE_URL}/web/index.php/api/v2/pim/employees?limit=50&offset=0&model=detailed&includeEmployees=onlyCurrent&sortField=employee.firstName&sortOrder=ASC`,
      {
        headers: {
          Host: HOST,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
          Accept: 'application/json',
          'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          'Cache-Control': 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0',
          Connection: 'keep-alive',
          Referer: `${BASE_URL}/web/index.php/pim/viewEmployeeList`,
        },
      }
    )
    // console.log ("List employees : ", response.json());
    check(response, {
      'GET 01 status 200':        (r) => r.status === 200,
      'GET 01 has data array':    (r) => r.json('data') !== null,
      'GET 01 total > 0':         (r) => r.json('meta.total') > 0
    });
    response = http.get(
      `${BASE_URL}/web/index.php/api/v2/admin/employment-statuses?limit=0`,
      {
        headers: {
          Host: HOST,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
          Accept: 'application/json',
          'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          'Cache-Control': 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0',
          Connection: 'keep-alive',
          Referer: `${BASE_URL}/web/index.php/pim/viewEmployeeList`,
        },
      }
    )
    response = http.get(
      `${BASE_URL}/web/index.php/api/v2/admin/job-titles?limit=0`,
      {
        headers: {
          Host: HOST,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
          Accept: 'application/json',
          'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          'Cache-Control': 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0',
          Connection: 'keep-alive',
          Referer: `${BASE_URL}/web/index.php/pim/viewEmployeeList`,
        },
      }
    )
    response = http.get(
      `${BASE_URL}/web/index.php/api/v2/admin/subunits`,
      {
        headers: {
          Host: HOST,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
          Accept: 'application/json',
          'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          'Cache-Control': 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0',
          Connection: 'keep-alive',
          Referer: `${BASE_URL}/web/index.php/pim/viewEmployeeList`,
        },
      }
    )
  });
}
export function addEmployee() {
  let response;
  let empNumber = null;
  group('03-Add Employee - /pim/addEmployee', function () {
    response = http.get(`${BASE_URL}/web/index.php/pim/addEmployee`, {
      headers: {
        Host: HOST,
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        Connection: 'keep-alive',
        Referer: `${BASE_URL}/web/index.php/pim/viewEmployeeList`,
      },
    })
    response = http.get(
      `${BASE_URL}/web/index.php/core/i18n/messages`,
      {
        headers: {
          Host: HOST,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
          Accept: 'application/json',
          'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          contentType: 'application/json',
          'If-None-Match': '"udPzp5tmK1qJ8SD5ih5TmI9iNvVEpV1lqd0luA2ddBE="',
          Connection: 'keep-alive',
          Referer: `${BASE_URL}/web/index.php/pim/addEmployee`,
        },
      }
    )
    response = http.get(
      `${BASE_URL}/web/index.php/pim/viewPhoto/empNumber/7`,
      {
        headers: {
          Host: HOST,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
          Accept: 'image/avif,image/webp,image/png,image/svg+xml,image/*;q=0.8,*/*;q=0.5',
          'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          Connection: 'keep-alive',
          Referer: `${BASE_URL}/web/index.php/pim/addEmployee`,
        },
      }
    )
    response = http.get(
      `${BASE_URL}/web/index.php/api/v2/pim/employees`,
      {
        headers: {
          Host: HOST,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
          Accept: 'application/json',
          'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          'Cache-Control': 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0',
          Connection: 'keep-alive',
          Referer: `${BASE_URL}/web/index.php/pim/addEmployee`,
        },
      }
    )
    response = http.get(
      `${BASE_URL}/web/index.php/api/v2/core/validation/unique?value=${empId}&entityName=Employee&attributeName=employeeId`,
      {
        headers: {
          Host: HOST,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
          Accept: 'application/json, text/plain, */*',
          'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          Connection: 'keep-alive',
          Referer: `${BASE_URL}/web/index.php/pim/addEmployee`,
        },
      }
    )
    response = http.get(
      `${BASE_URL}/web/index.php/api/v2/core/validation/unique?value=${empId}&entityName=Employee&attributeName=employeeId`,
      {
        headers: {
          Host: HOST,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
          Accept: 'application/json, text/plain, */*',
          'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          Connection: 'keep-alive',
          Referer: `${BASE_URL}/web/index.php/pim/addEmployee`,
        },
      }
    );
    response = http.post(
      `${BASE_URL}/web/index.php/api/v2/pim/employees`,
       `{"firstName":"K6_${empId}","middleName":"","lastName":"Training_${empId}","empPicture":null,"employeeId":"${empId}"}`,
      {
        headers: {
          Host: HOST,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
          Accept: 'application/json',
          'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          'Content-Type': 'application/json',
          Origin: `${BASE_URL}`,
          Connection: 'keep-alive',
          Referer: `${BASE_URL}/web/index.php/pim/addEmployee`,
        },
      }
    );
    console.log ("Add employees : ", response.json());
    check(response, {
      'Add Employee status 200':        (r) => r.status === 200,
      'has data array':    (r) => r.json('data') !== null,
      'empNumber gte 0': (r) => r.json('data.empNumber') > 0,
    });
    
    empNumber = response.json('data.empNumber');
    response = http.get(
      `${BASE_URL}/web/index.php/pim/viewPersonalDetails/empNumber/${empNumber}`,
      {
        headers: {
          Host: HOST,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          Connection: 'keep-alive',
          Referer: `${BASE_URL}/web/index.php/pim/addEmployee`,
        },
      }
    );
    response = http.get(
      `${BASE_URL}/web/index.php/core/i18n/messages`,
      {
        headers: {
          Host: HOST,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
          Accept: 'application/json',
          'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          contentType: 'application/json',
          'If-None-Match': '"udPzp5tmK1qJ8SD5ih5TmI9iNvVEpV1lqd0luA2ddBE="',
          Connection: 'keep-alive',
          Referer: `${BASE_URL}/web/index.php/pim/viewPersonalDetails/empNumber/${empNumber}`,
        },
      }
    );
    response = http.get(
      `${BASE_URL}/web/index.php/pim/viewPhoto/empNumber/${empNumber}`,
      {
        headers: {
          Host: HOST,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
          Accept: 'image/avif,image/webp,image/png,image/svg+xml,image/*;q=0.8,*/*;q=0.5',
          'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          Connection: 'keep-alive',
          Referer: `${BASE_URL}/web/index.php/pim/viewPersonalDetails/empNumber/${empNumber}`,
        },
      }
    );
    response = http.get(
      `${BASE_URL}/web/index.php/api/v2/pim/employees/${empNumber}/personal-details`,
      {
        headers: {
          Host: HOST,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
          Accept: 'application/json',
          'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          'Cache-Control': 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0',
          Connection: 'keep-alive',
          Referer: `${BASE_URL}/web/index.php/pim/viewPersonalDetails/empNumber/${empNumber}`,
        },
      }
    );
    response = http.get(
      `${BASE_URL}/web/index.php/api/v2/pim/employees/${empNumber}`,
      {
        headers: {
          Host: HOST,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
          Accept: 'application/json, text/plain, */*',
          'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          Connection: 'keep-alive',
          Referer: `${BASE_URL}/web/index.php/pim/viewPersonalDetails/empNumber/${empNumber}`,
        },
      }
    );
    response = http.get(
      `${BASE_URL}/web/index.php/api/v2/leave/workweek?model=indexed`,
      {
        headers: {
          Host: HOST,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
          Accept: 'application/json, text/plain, */*',
          'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          Connection: 'keep-alive',
          Referer: `${BASE_URL}/web/index.php/pim/viewPersonalDetails/empNumber/${empNumber}`,
        },
      }
    );
    response = http.get(
      `${BASE_URL}/web/index.php/api/v2/leave/workweek?model=indexed`,
      {
        headers: {
          Host: HOST,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
          Accept: 'application/json, text/plain, */*',
          'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          Connection: 'keep-alive',
          Referer: `${BASE_URL}/web/index.php/pim/viewPersonalDetails/empNumber/${empNumber}`,
        },
      }
    );
    response = http.get(
      `${BASE_URL}/web/index.php/api/v2/pim/employees/${empNumber}/custom-fields?screen=personal`,
      {
        headers: {
          Host: HOST,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
          Accept: 'application/json',
          'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          'Cache-Control': 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0',
          Connection: 'keep-alive',
          Referer: `${BASE_URL}/web/index.php/pim/viewPersonalDetails/empNumber/${empNumber}`,
        },
      }
    );
    response = http.get(
      `${BASE_URL}/web/index.php/api/v2/pim/employees/${empNumber}/screen/personal/attachments?limit=50&offset=0`,
      {
        headers: {
          Host: HOST,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
          Accept: 'application/json',
          'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          'Cache-Control': 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0',
          Connection: 'keep-alive',
          Referer: `${BASE_URL}/web/index.php/pim/viewPersonalDetails/empNumber/${empNumber}`,
        },
      }
    );
    response = http.get(
      `${BASE_URL}/web/index.php/api/v2/leave/holidays?fromDate=2026-01-01&toDate=2026-12-31`,
      {
        headers: {
          Host: HOST,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
          Accept: 'application/json, text/plain, */*',
          'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          Connection: 'keep-alive',
          Referer: `${BASE_URL}/web/index.php/pim/viewPersonalDetails/empNumber/${empNumber}`,
        },
      }
    );
    response = http.get(
      `${BASE_URL}/web/index.php/api/v2/leave/holidays?fromDate=2026-01-01&toDate=2026-12-31`,
      {
        headers: {
          Host: HOST,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
          Accept: 'application/json, text/plain, */*',
          'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          Connection: 'keep-alive',
          Referer: `${BASE_URL}/web/index.php/pim/viewPersonalDetails/empNumber/${empNumber}`,
        },
      }
    );
    response = http.get(
      `${BASE_URL}/web/index.php/api/v2/pim/employees`,
      {
        headers: {
          Host: HOST,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
          Accept: 'application/json, text/plain, */*',
          'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          Connection: 'keep-alive',
          Referer: `${BASE_URL}/web/index.php/pim/viewPersonalDetails/empNumber/${empNumber}`,
        },
      }
    );
    response = http.put(
      `${BASE_URL}/web/index.php/api/v2/pim/employees/${empNumber}/personal-details`,
      `{"lastName":"Training_${empId}","firstName":"K6_${empId}","middleName":"","employeeId":"${empId}","otherId":"","drivingLicenseNo":"","drivingLicenseExpiredDate":null,"gender":"1","maritalStatus":"Single","birthday":"1986-02-11","nationalityId":64}`,
      {
        headers: {
          Host: HOST,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
          Accept: 'application/json, text/plain, */*',
          'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          'Content-Type': 'application/json',
          Origin: `${BASE_URL}`,
          Connection: 'keep-alive',
          Referer: `${BASE_URL}/web/index.php/pim/viewPersonalDetails/empNumber/${empNumber}`,
        },
      }
    );

    check(response, {
    'Personal details status 200': (r) => r.status === 200,
    });

    response = http.get(
      `${BASE_URL}/web/index.php/pim/viewPimModule`,
      {
        headers: {
          Host: HOST,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          Connection: 'keep-alive',
          Referer: `${BASE_URL}/web/index.php/pim/viewPersonalDetails/empNumber/${empNumber}`,
        },
      }
    );
    response = http.get(
      `${BASE_URL}/web/index.php/pim/viewEmployeeList`,
      {
        headers: {
          Host: HOST,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          Referer: `${BASE_URL}/web/index.php/pim/viewPersonalDetails/empNumber/${empNumber}`,
          Connection: 'keep-alive',
        },
      }
    );
    response = http.get(
      `${BASE_URL}/web/index.php/core/i18n/messages`,
      {
        headers: {
          Host: HOST,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
          Accept: 'application/json',
          'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          contentType: 'application/json',
          'If-None-Match': '"udPzp5tmK1qJ8SD5ih5TmI9iNvVEpV1lqd0luA2ddBE="',
          Connection: 'keep-alive',
          Referer: `${BASE_URL}/web/index.php/pim/viewEmployeeList`,
        },
      }
    );
    response = http.get(
      `${BASE_URL}/web/index.php/api/v2/pim/employees?limit=50&offset=0&model=detailed&includeEmployees=onlyCurrent&sortField=employee.firstName&sortOrder=ASC`,
      {
        headers: {
          Host: HOST,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
          Accept: 'application/json',
          'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          'Cache-Control': 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0',
          Connection: 'keep-alive',
          Referer: `${BASE_URL}/web/index.php/pim/viewEmployeeList`,
        },
      }
    );
    response = http.get(
      `${BASE_URL}/web/index.php/api/v2/admin/employment-statuses?limit=0`,
      {
        headers: {
          Host: HOST,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
          Accept: 'application/json',
          'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          'Cache-Control': 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0',
          Connection: 'keep-alive',
          Referer: `${BASE_URL}/web/index.php/pim/viewEmployeeList`,
        },
      }
    );
    response = http.get(
      `${BASE_URL}/web/index.php/api/v2/admin/job-titles?limit=0`,
      {
        headers: {
          Host: HOST,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
          Accept: 'application/json',
          'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          'Cache-Control': 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0',
          Connection: 'keep-alive',
          Referer: `${BASE_URL}/web/index.php/pim/viewEmployeeList`,
        },
      }
    );
    response = http.get(
      `${BASE_URL}/web/index.php/api/v2/admin/subunits`,
      {
        headers: {
          Host: HOST,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
          Accept: 'application/json',
          'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          'Cache-Control': 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0',
          Connection: 'keep-alive',
          Referer: `${BASE_URL}/web/index.php/pim/viewEmployeeList`,
        },
      }
    );
  });
  return (empNumber);
}

export function employeeContactDetails(empNumber) {
  let response;
  group('04-Employee Contact Details - /pim/employee/{id}/contact-details', function () {
    response = http.get(
      `${BASE_URL}/web/index.php/api/v2/pim/employees?nameOrId=K&includeEmployees=onlyCurrent`,
      {
        headers: {
          Host: HOST,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
          Accept: 'application/json',
          'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          'Cache-Control': 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0',
          Connection: 'keep-alive',
          Referer: `${BASE_URL}/web/index.php/pim/viewEmployeeList`,
        },
      }
    );

    response = http.get(
      `${BASE_URL}/web/index.php/api/v2/pim/employees?nameOrId=K6&includeEmployees=onlyCurrent`,
      {
        headers: {
          Host: HOST,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
          Accept: 'application/json',
          'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          'Cache-Control': 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0',
          Connection: 'keep-alive',
          Referer: `${BASE_URL}/web/index.php/pim/viewEmployeeList`,
        },
      }
    )

    response = http.get(
      `${BASE_URL}/web/index.php/api/v2/pim/employees?limit=50&offset=0&model=detailed&nameOrId=K6&includeEmployees=onlyCurrent&sortField=employee.firstName&sortOrder=ASC`,
      {
        headers: {
          Host: HOST,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
          Accept: 'application/json',
          'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          'Cache-Control': 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0',
          Connection: 'keep-alive',
          Referer: `${BASE_URL}/web/index.php/pim/viewEmployeeList`,
        },
      }
    )

    response = http.get(
      `${BASE_URL}/web/index.php/pim/viewPersonalDetails/empNumber/${empNumber}`,
      {
        headers: {
          Host: HOST,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          Connection: 'keep-alive',
          Referer: `${BASE_URL}/web/index.php/pim/viewEmployeeList`,
        },
      }
    )

    response = http.get(
      `${BASE_URL}/web/index.php/core/i18n/messages`,
      {
        headers: {
          Host: HOST,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
          Accept: 'application/json',
          'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          contentType: 'application/json',
          'If-None-Match': '"udPzp5tmK1qJ8SD5ih5TmI9iNvVEpV1lqd0luA2ddBE="',
          Connection: 'keep-alive',
          Referer:
            `${BASE_URL}/web/index.php/pim/viewPersonalDetails/empNumber/${empNumber}`,
        },
      }
    )

    response = http.get(
      `${BASE_URL}/web/index.php/pim/viewPhoto/empNumber/7`,
      {
        headers: {
          Host: HOST,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
          Accept: 'image/avif,image/webp,image/png,image/svg+xml,image/*;q=0.8,*/*;q=0.5',
          'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          Connection: 'keep-alive',
          Referer:
            `${BASE_URL}/web/index.php/pim/viewPersonalDetails/empNumber/${empNumber}`,
        },
      }
    )

    response = http.get(
      `${BASE_URL}/web/index.php/pim/viewPhoto/empNumber/${empNumber}`,
      {
        headers: {
          Host: HOST,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
          Accept: 'image/avif,image/webp,image/png,image/svg+xml,image/*;q=0.8,*/*;q=0.5',
          'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          Connection: 'keep-alive',
          Referer:
            `${BASE_URL}/web/index.php/pim/viewPersonalDetails/empNumber/${empNumber}`,
        },
      }
    )

    response = http.get(
      `${BASE_URL}/web/index.php/api/v2/pim/employees/${empNumber}/personal-details`,
      {
        headers: {
          Host: HOST,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
          Accept: 'application/json',
          'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          'Cache-Control': 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0',
          Connection: 'keep-alive',
          Referer:
            `${BASE_URL}/web/index.php/pim/viewPersonalDetails/empNumber/${empNumber}`,
        },
      }
    )

    response = http.get(
      `${BASE_URL}/web/index.php/api/v2/pim/employees/${empNumber}`,
      {
        headers: {
          Host: HOST,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
          Accept: 'application/json, text/plain, */*',
          'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          Connection: 'keep-alive',
          Referer:
            `${BASE_URL}/web/index.php/pim/viewPersonalDetails/empNumber/${empNumber}`,
        },
      }
    )

    response = http.get(
      `${BASE_URL}/web/index.php/api/v2/leave/workweek?model=indexed`,
      {
        headers: {
          Host: HOST,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
          Accept: 'application/json, text/plain, */*',
          'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          Connection: 'keep-alive',
          Referer:
            `${BASE_URL}/web/index.php/pim/viewPersonalDetails/empNumber/${empNumber}`,
        },
      }
    )

    response = http.get(
      `${BASE_URL}/web/index.php/api/v2/leave/workweek?model=indexed`,
      {
        headers: {
          Host: HOST,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
          Accept: 'application/json, text/plain, */*',
          'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          Connection: 'keep-alive',
          Referer:
            `${BASE_URL}/web/index.php/pim/viewPersonalDetails/empNumber/${empNumber}`,
        },
      }
    )

    response = http.get(
      `${BASE_URL}/web/index.php/api/v2/pim/employees/${empNumber}/custom-fields?screen=personal`,
      {
        headers: {
          Host: HOST,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
          Accept: 'application/json',
          'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          'Cache-Control': 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0',
          Connection: 'keep-alive',
          Referer:
            `${BASE_URL}/web/index.php/pim/viewPersonalDetails/empNumber/${empNumber}`,
        },
      }
    )

    response = http.get(
      `${BASE_URL}/web/index.php/api/v2/pim/employees/${empNumber}/screen/personal/attachments?limit=50&offset=0`,
      {
        headers: {
          Host: HOST,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
          Accept: 'application/json',
          'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          'Cache-Control': 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0',
          Connection: 'keep-alive',
          Referer:
            `${BASE_URL}/web/index.php/pim/viewPersonalDetails/empNumber/${empNumber}`,
        },
      }
    )

    response = http.get(
      `${BASE_URL}/web/index.php/api/v2/leave/holidays?fromDate=2026-01-01&toDate=2026-12-31`,
      {
        headers: {
          Host: HOST,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
          Accept: 'application/json, text/plain, */*',
          'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          Connection: 'keep-alive',
          Referer:
            `${BASE_URL}/web/index.php/pim/viewPersonalDetails/empNumber/${empNumber}`,
        },
      }
    )

    response = http.get(
      `${BASE_URL}/web/index.php/api/v2/leave/holidays?fromDate=2026-01-01&toDate=2026-12-31`,
      {
        headers: {
          Host: HOST,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
          Accept: 'application/json, text/plain, */*',
          'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          Connection: 'keep-alive',
          Referer:
            `${BASE_URL}/web/index.php/pim/viewPersonalDetails/empNumber/${empNumber}`,
        },
      }
    )

    response = http.get(
      `${BASE_URL}/web/index.php/api/v2/pim/employees`,
      {
        headers: {
          Host: HOST,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
          Accept: 'application/json, text/plain, */*',
          'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          Connection: 'keep-alive',
          Referer:
            `${BASE_URL}/web/index.php/pim/viewPersonalDetails/empNumber/${empNumber}`,
        },
      }
    )

    response = http.get(
      `${BASE_URL}/web/index.php/pim/contactDetails/empNumber/${empNumber}`,
      {
        headers: {
          Host: HOST,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          Connection: 'keep-alive',
          Referer:
            `${BASE_URL}/web/index.php/pim/viewPersonalDetails/empNumber/${empNumber}`,
        },
      }
    )

    response = http.get(
      `${BASE_URL}/web/index.php/core/i18n/messages`,
      {
        headers: {
          Host: HOST,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
          Accept: 'application/json',
          'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          contentType: 'application/json',
          'If-None-Match': '"udPzp5tmK1qJ8SD5ih5TmI9iNvVEpV1lqd0luA2ddBE="',
          Connection: 'keep-alive',
          Referer:
            `${BASE_URL}/web/index.php/pim/contactDetails/empNumber/${empNumber}`,
        },
      }
    )

    response = http.get(
      `${BASE_URL}/web/index.php/api/v2/pim/employee/${empNumber}/contact-details`,
      {
        headers: {
          Host: HOST,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
          Accept: 'application/json',
          'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          'Cache-Control': 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0',
          Connection: 'keep-alive',
          Referer:
            `${BASE_URL}/web/index.php/pim/contactDetails/empNumber/${empNumber}`,
        },
      }
    )

    response = http.get(
      `${BASE_URL}/web/index.php/api/v2/pim/employees/${empNumber}`,
      {
        headers: {
          Host: HOST,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
          Accept: 'application/json, text/plain, */*',
          'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          Connection: 'keep-alive',
          Referer:
            `${BASE_URL}/web/index.php/pim/contactDetails/empNumber/${empNumber}`,
        },
      }
    )

    response = http.get(
      `${BASE_URL}/web/index.php/pim/viewPhoto/empNumber/7`,
      {
        headers: {
          Host: HOST,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
          Accept: 'image/avif,image/webp,image/png,image/svg+xml,image/*;q=0.8,*/*;q=0.5',
          'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          Connection: 'keep-alive',
          Referer:
            `${BASE_URL}/web/index.php/pim/contactDetails/empNumber/${empNumber}`,
        },
      }
    )

    response = http.get(
      `${BASE_URL}/web/index.php/api/v2/pim/employees/${empNumber}/custom-fields?screen=contact`,
      {
        headers: {
          Host: HOST,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
          Accept: 'application/json',
          'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          'Cache-Control': 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0',
          Connection: 'keep-alive',
          Referer:
            `${BASE_URL}/web/index.php/pim/contactDetails/empNumber/${empNumber}`,
        },
      }
    )

    response = http.get(
      `${BASE_URL}/web/index.php/pim/viewPhoto/empNumber/${empNumber}`,
      {
        headers: {
          Host: HOST,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
          Accept: 'image/avif,image/webp,image/png,image/svg+xml,image/*;q=0.8,*/*;q=0.5',
          'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          Connection: 'keep-alive',
          Referer:
            `${BASE_URL}/web/index.php/pim/contactDetails/empNumber/${empNumber}`,
        },
      }
    )

    response = http.get(
      `${BASE_URL}/web/index.php/api/v2/pim/employees/${empNumber}/screen/contact/attachments?limit=50&offset=0`,
      {
        headers: {
          Host: HOST,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
          Accept: 'application/json',
          'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          'Cache-Control': 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0',
          Connection: 'keep-alive',
          Referer:
            `${BASE_URL}/web/index.php/pim/contactDetails/empNumber/${empNumber}`,
        },
      }
    )

    response = http.get(
      `${BASE_URL}/web/index.php/api/v2/pim/employees/${empNumber}/contact-details/validation/work-emails?workEmail=k6.training%40demo.test`,
      {
        headers: {
          Host: HOST,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
          Accept: 'application/json, text/plain, */*',
          'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          Connection: 'keep-alive',
          Referer:
            `${BASE_URL}/web/index.php/pim/contactDetails/empNumber/${empNumber}`,
        },
      }
    )

    response = http.get(
      `${BASE_URL}/web/index.php/api/v2/pim/employees/${empNumber}/contact-details/validation/work-emails?workEmail=k6.training%40demo.test`,
      {
        headers: {
          Host: HOST,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
          Accept: 'application/json, text/plain, */*',
          'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          Connection: 'keep-alive',
          Referer:
            `${BASE_URL}/web/index.php/pim/contactDetails/empNumber/${empNumber}`,
        },
      }
    )

    response = http.put(
      `${BASE_URL}/web/index.php/api/v2/pim/employee/${empNumber}/contact-details`,
      `{"street1":"29 RUE DES SABLONS","street2":"","city":"PARIS","province":"PARIS","countryCode":"FR","zipCode":"75008","homeTelephone":"0145464748","workTelephone":null,"mobile":"0611223344","workEmail":"k6.training${empNumber}@demo.test","otherEmail":null}`,
      {
        headers: {
          Host: HOST,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
          Accept: 'application/json, text/plain, */*',
          'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          'Content-Type': 'application/json',
          Origin: `${BASE_URL}`,
          Connection: 'keep-alive',
          Referer:
            `${BASE_URL}/web/index.php/pim/contactDetails/empNumber/${empNumber}`,
        },
      }
    );
    console.log(`Contact details update response status: ${response.status}`);
    check(response, {
    'Contact details status 200': (r) => r.status === 200,
    });


  });
}

export function deleteEmployee(empNumber) {
  let response;

    group('05-Delete Employee - /api/v2/pim/employees', function () {
    response = http.get(
      `${BASE_URL}/web/index.php/pim/viewPimModule`,
      {
        headers: {
          Host: HOST,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          Connection: 'keep-alive',
          Referer:
          `${BASE_URL}/web/index.php/pim/contactDetails/empNumber/${empNumber}`,
        },
      }
    )

    response = http.get(
      `${BASE_URL}/web/index.php/pim/viewEmployeeList`,
      {
        headers: {
          Host: HOST,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          Referer:
            `${BASE_URL}/web/index.php/pim/contactDetails/empNumber/${empNumber}`,
          Connection: 'keep-alive',
        },
      }
    )

    response = http.get(
      `${BASE_URL}/web/index.php/core/i18n/messages`,
      {
        headers: {
          Host: HOST,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
          Accept: 'application/json',
          'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          contentType: 'application/json',
          'If-None-Match': '"udPzp5tmK1qJ8SD5ih5TmI9iNvVEpV1lqd0luA2ddBE="',
          Connection: 'keep-alive',
          Referer: `${BASE_URL}/web/index.php/pim/viewEmployeeList`,
        },
      }
    )

    response = http.get(
      `${BASE_URL}/web/index.php/pim/viewPhoto/empNumber/7`,
      {
        headers: {
          Host: HOST,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
          Accept: 'image/avif,image/webp,image/png,image/svg+xml,image/*;q=0.8,*/*;q=0.5',
          'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          Connection: 'keep-alive',
          Referer: `${BASE_URL}/web/index.php/pim/viewEmployeeList`,
        },
      }
    )

    response = http.get(
      `${BASE_URL}/web/index.php/api/v2/pim/employees?limit=50&offset=0&model=detailed&includeEmployees=onlyCurrent&sortField=employee.firstName&sortOrder=ASC`,
      {
        headers: {
          Host: HOST,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
          Accept: 'application/json',
          'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          'Cache-Control': 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0',
          Connection: 'keep-alive',
          Referer: `${BASE_URL}/web/index.php/pim/viewEmployeeList`,
        },
      }
    )

    response = http.get(
      `${BASE_URL}/web/index.php/api/v2/admin/employment-statuses?limit=0`,
      {
        headers: {
          Host: HOST,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
          Accept: 'application/json',
          'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          'Cache-Control': 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0',
          Connection: 'keep-alive',
          Referer: `${BASE_URL}/web/index.php/pim/viewEmployeeList`,
        },
      }
    )

    response = http.get(
      `${BASE_URL}/web/index.php/api/v2/admin/job-titles?limit=0`,
      {
        headers: {
          Host: HOST,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
          Accept: 'application/json',
          'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          'Cache-Control': 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0',
          Connection: 'keep-alive',
          Referer: `${BASE_URL}/web/index.php/pim/viewEmployeeList`,
        },
      }
    )

    response = http.get(
      `${BASE_URL}/web/index.php/api/v2/admin/subunits`,
      {
        headers: {
          Host: HOST,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
          Accept: 'application/json',
          'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          'Cache-Control': 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0',
          Connection: 'keep-alive',
          Referer: `${BASE_URL}/web/index.php/pim/viewEmployeeList`,
        },
      }
    )

    response = http.get(
      `${BASE_URL}/web/index.php/api/v2/pim/employees?limit=50&offset=0&model=detailed&employeeId=123654&includeEmployees=onlyCurrent&sortField=employee.firstName&sortOrder=ASC`,
      {
        headers: {
          Host: HOST,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
          Accept: 'application/json',
          'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          'Cache-Control': 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0',
          Connection: 'keep-alive',
          Referer: `${BASE_URL}/web/index.php/pim/viewEmployeeList`,
        },
      }
    )

    response = http.del(
      `${BASE_URL}/web/index.php/api/v2/pim/employees`,
      `{"ids":[${empNumber}]}`,
      {
        headers: {
          Host: HOST,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
          Accept: 'application/json, text/plain, */*',
          'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          'Content-Type': 'application/json',
          Origin: `${BASE_URL}`,
          Connection: 'keep-alive',
          Referer: `${BASE_URL}/web/index.php/pim/viewEmployeeList`,
        },
      }
    );
    check(response, {
    'Delete employee status 200': (r) => r.status === 200,
    });


    response = http.get(
      `${BASE_URL}/web/index.php/api/v2/pim/employees?limit=50&offset=0&model=detailed&employeeId=123654&includeEmployees=onlyCurrent&sortField=employee.firstName&sortOrder=ASC`,
      {
        headers: {
          Host: HOST,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
          Accept: 'application/json',
          'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          'Cache-Control': 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0',
          Connection: 'keep-alive',
          Referer: `${BASE_URL}/web/index.php/pim/viewEmployeeList`,
        },
      }
    )
  });
}

export function logout() {
  let response
  group('05-Logout - /pim/addEmployee', function () {
    response = http.get(`${BASE_URL}/web/index.php/auth/logout`, {
      headers: {
        Host: HOST,
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        Connection: 'keep-alive',
        Referer: `${BASE_URL}/web/index.php/pim/viewEmployeeList`,
      },
    });
    check(response, {
    '09 status 200': (r) => r.status === 200,
    });
    response = http.get(`${BASE_URL}/web/index.php/auth/login`, {
      headers: {
        Host: HOST,
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'fr-FR,en-US;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        Referer: `${BASE_URL}/web/index.php/pim/viewEmployeeList`,
        Connection: 'keep-alive',
      },
    });
    console.log ("10 Logout : ", response.status);
    check(response, {
     '10 status 200': (r) => r.status === 200,
    });
  });
}
