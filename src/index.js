import inquirer from 'inquirer';
import {
  viewAllDepartments,
  viewAllRoles,
  viewAllEmployees,
  addDepartment,
  addRole,
  addEmployee,
  updateEmployeeRole,
} from './dbFunctions/index.js';

// Start the application
startApp();

// Function to start the application
function startApp() {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          'View all departments',
          'View all roles',
          'View all employees',
          'Add a department',
          'Add a role',
          'Add an employee',
          'Update an employee role',
          'Exit',
        ],
      },
    ])
    .then(async (answer) => {
      try {
        switch (answer.action) {
          case 'View all departments':
            await viewAllDepartments();
            break;

          case 'View all roles':
            await viewAllRoles();
            break;

          case 'View all employees':
            await viewAllEmployees();
            break;

          case 'Add a department':
            await addDepartment();
            break;

          case 'Add a role':
            await addRole();
            break;

          case 'Add an employee':
            await addEmployee();
            break;

          case 'Update an employee role':
            await updateEmployeeRole();
            break;

          case 'Exit':
            console.log('Goodbye!');
            break;

          default:
            console.log('Invalid choice. Please select a valid option.');
        }
      } catch (error) {
        console.error('An error occurred:', error.message);
      } finally {
        // Ask the user if they want to perform another action
        continueAsking();
      }
    });
}

// Function to ask the user if they want to perform another action
function continueAsking() {
  inquirer
    .prompt([
      {
        type: 'confirm',
        name: 'anotherAction',
        message: 'Do you want to perform another action?',
        default: true,
      },
    ])
    .then((answer) => {
      if (answer.anotherAction) {
        startApp(); // If yes, restart the application
      } else {
        console.log('Goodbye!');
      }
    });
}
