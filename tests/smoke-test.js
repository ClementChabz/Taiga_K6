import { sleep } from 'k6'
import { login, viewPimModule, addEmployee, employeeContactDetails, deleteEmployee, logout } from '../modules/employee.js'

export default function main() {
  login();
  viewPimModule();
  const empNumber = addEmployee();
  console.log ("Employee number : ", empNumber);
  employeeContactDetails(empNumber);
  deleteEmployee(empNumber);
  logout();
}

