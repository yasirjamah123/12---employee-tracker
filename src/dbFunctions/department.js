// Import necessary modules
import mysql from 'mysql2/promise';
import inquirer from 'inquirer';
import dotenv from 'dotenv';
import consoleTable from 'console.table';

dotenv.config();

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE } = process.env;

// Function to view all departments
const viewAllDepartments = async () => {
  const pool = await mysql.createPool({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE,
  });

  try {
    const [rows] = await pool.execute('SELECT * FROM department');
    console.table('Departments:', rows);
  } catch (error) {
    console.error(error.message);
  } finally {
    pool.end(); // Make sure to end the pool, not the connection
  }
};

// Function to add a department
const addDepartment = async () => {
  const connection = await mysql.createConnection({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE,
  });

  try {
    const departmentData = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Enter the name of the department:',
        validate: (input) => input.trim() !== '', // Validate that the input is not empty
      },
    ]);

    await connection.execute('INSERT INTO department (name) VALUES (?)', [departmentData.name]);
    console.log(`Department '${departmentData.name}' added successfully.`);
  } catch (error) {
    console.error(error.message);
  } finally {
    connection.end();
  }
};

// Export the functions
export { viewAllDepartments, addDepartment };
