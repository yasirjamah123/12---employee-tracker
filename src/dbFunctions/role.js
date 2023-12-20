import mysql from 'mysql2/promise';
import inquirer from 'inquirer';
import dotenv from 'dotenv';
import consoleTable from 'console.table';

dotenv.config();

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE } = process.env;

// Function to view all roles
const viewAllRoles = async () => {
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
          role.id,
          role.title,
          role.salary,
          department.name AS department_name
        FROM role
        LEFT JOIN department ON role.department_id = department.id
      `);
        console.table('Roles:', rows);
    } catch (error) {
        console.error(error.message);
    } finally {
        connection.end();
    }
};

// Function to add a role
const addRole = async () => {
    const connection = await mysql.createConnection({
        host: DB_HOST,
        port: DB_PORT,
        user: DB_USER,
        password: DB_PASSWORD,
        database: DB_DATABASE,
    });

    try {
        // Get role details from the user using inquirer prompts
        const roleData = await inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: 'Enter the title of the role:',
                validate: (input) => input.trim() !== '',
            },
            {
                type: 'input',
                name: 'salary',
                message: 'Enter the salary for the role:',
                validate: (input) => !isNaN(input) && parseFloat(input) >= 0, // Validate that the input is a non-negative number
            },
            {
                type: 'list',
                name: 'departmentId',
                message: 'Select the department for the role:',
                choices: await getDepartmentChoices(connection),
            },
        ]);

        await connection.execute('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [
            roleData.title,
            roleData.salary,
            roleData.departmentId,
        ]);

        console.log(`Role '${roleData.title}' added successfully.`);
    } catch (error) {
        console.error(error.message);
    } finally {
        connection.end();
    }
};

// Function to get department choices for inquirer prompt
const getDepartmentChoices = async (connection) => {
    const [departments] = await connection.execute('SELECT id, name FROM department');
    return departments.map((department) => ({ name: department.name, value: department.id }));
};


// Export the functions
export { viewAllRoles, addRole };
