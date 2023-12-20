import mysql from 'mysql2/promise';
import inquirer from 'inquirer';
import dotenv from 'dotenv';
import consoleTable from 'console.table';

dotenv.config();

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE } = process.env;

// Function to add an employee
const addEmployee = async () => {
  const connection = await mysql.createConnection({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE,
  });

  try {
    // Get employee details from the user using inquirer prompts
    const employeeData = await inquirer.prompt([
      {
        type: 'input',
        name: 'firstName',
        message: "Enter the employee's first name:",
        validate: (input) => input.trim() !== '',
      },
      {
        type: 'input',
        name: 'lastName',
        message: "Enter the employee's last name:",
        validate: (input) => input.trim() !== '',
      },
      {
        type: 'list',
        name: 'roleId',
        message: "Select the employee's role:",
        choices: await getRoleChoices(connection),
      },
      {
        type: 'list',
        name: 'managerId',
        message: "Select the employee's manager:",
        choices: await getEmployeeChoices(connection),
      },
    ]);

    await connection.execute(
      'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)',
      [employeeData.firstName, employeeData.lastName, employeeData.roleId, employeeData.managerId]
    );

    console.log(`Employee '${employeeData.firstName} ${employeeData.lastName}' added successfully.`);
  } catch (error) {
    console.error(error.message);
  } finally {
    connection.end();
  }
};

// Function to get role choices for inquirer prompt
const getRoleChoices = async (connection) => {
  const [roles] = await connection.execute('SELECT id, title FROM role');
  return roles.map((role) => ({ name: role.title, value: role.id }));
};

// Function to get employee choices for inquirer prompt
const getEmployeeChoices = async (connection) => {
  const [employees] = await connection.execute('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee');
  return employees.map((employee) => ({ name: employee.name, value: employee.id }));
};
// Function to view all employees
const viewAllEmployees = async () => {
  const connection = await mysql.createConnection({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE,
  });

  try {
    const [rows] = await connection.execute(`
      SELECT 
        e.id, 
        e.first_name, 
        e.last_name, 
        r.title AS job_title, 
        d.name AS department, 
        r.salary, 
        CONCAT(m.first_name, ' ', m.last_name) AS manager
      FROM employee e
      LEFT JOIN role r ON e.role_id = r.id
      LEFT JOIN department d ON r.department_id = d.id
      LEFT JOIN employee m ON e.manager_id = m.id
    `);
    console.table('Employees:', rows);
  } catch (error) {
    console.error(error.message);
  } finally {
    connection.end();
  }
};

// Function to update employee role
const updateEmployeeRole = async () => {
  const connection = await mysql.createConnection({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE,
  });

  try {
    const employees = await connection.execute('SELECT id, CONCAT(first_name, " ", last_name) AS employee FROM employee');
    const roles = await connection.execute('SELECT id, title FROM role');

    const updateData = await inquirer.prompt([
      {
        type: 'list',
        name: 'employee_id',
        message: 'Select the employee to update:',
        choices: employees[0].map((employee) => ({ name: employee.employee, value: employee.id })),
      },
      {
        type: 'list',
        name: 'role_id',
        message: 'Select the new role:',
        choices: roles[0].map((role) => ({ name: role.title, value: role.id })),
      },
    ]);

    await connection.execute('UPDATE employee SET role_id = ? WHERE id = ?', [updateData.role_id, updateData.employee_id]);
    console.log(`Employee role updated successfully.`);
  } catch (error) {
    console.error(error.message);
  } finally {
    connection.end();
  }
};

// Export the functions
export { viewAllEmployees, addEmployee, updateEmployeeRole };
