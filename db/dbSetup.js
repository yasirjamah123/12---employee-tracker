// db/dbSetup.js
import mysql from 'mysql2/promise';
import fs from 'fs/promises';
import dotenv from 'dotenv';

dotenv.config();

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE } = process.env;

// Helper function to execute SQL statements from seeds.sql
const executeSeedSQL = async () => {
  const pool = mysql.createPool({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE,
  });

  try {
    // Read seeds.sql file
    const fileContent = await fs.readFile('./db/seeds.sql', 'utf-8');
    // Split the file content into individual SQL statements
    const sqlStatements = fileContent.split(';').filter((sql) => sql.trim() !== '');

    // Execute each SQL statement
    for (const sqlStatement of sqlStatements) {
      await pool.execute(sqlStatement);
    }

    console.log('Tables created with initial data');
  } catch (error) {
    console.error(error.message);
  } finally {
    pool.end();
  }
};

// Execute the setup
const setupDatabase = async () => {
  const pool = mysql.createPool({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
  });

  try {
    // Create employee_db database if not exists
    await pool.execute(`CREATE DATABASE IF NOT EXISTS ${DB_DATABASE}`);

    // Execute SQL statements from seeds.sql
    await executeSeedSQL();
  } catch (error) {
    console.error(error.message);
  } finally {
    pool.end();
  }
};

// Execute the setup
setupDatabase();
