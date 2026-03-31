import { sleep } from 'k6'
import { login, viewPimModule, addEmployee, employeeContactDetails, deleteEmployee, logout } from '../modules/employee.js'

export const options = {
  scenarios: {
    login_logout: {
      executor: 'constant-vus',
      vus: 9,             // 90% de 10 VUs au total
      duration: '5m',
      exec: 'vu_login_logout',
    },
    add_employe: {
      executor: 'constant-vus',
      vus: 1,            // 10% de 10 VUs au total
      duration: '5m',
      exec: 'vu_add_employee',
    },
  },
};

export function vu_login_logout() {
  login();
  viewPimModule();
  logout();
}

export function vu_add_employee() {
  login();
  viewPimModule();
  const empNumber = addEmployee();
  console.log ("Employee number : ", empNumber);
  employeeContactDetails(empNumber);
  logout();
}

