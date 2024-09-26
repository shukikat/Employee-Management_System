import express from 'express';
import { QueryResult } from 'pg';
import { pool, connectToDb } from './connection.js';
import inquirer from 'inquirer';

await connectToDb();

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const questions (): void  {
  inquirer
    .prompt([

      {
        type: 'list',
        name: 'choices',
        message: 'What would you like to do?',
        choices: ['View All Departments', 'View All Roles', 'View All Employees', "Add A Department", "Add A Role", "Add An Employee", "Update an Employee Role"]

      }

    ])

    .then((answers): void => {

      if (answers.choices === 'View All Departments') {
        pool.query(`SELECT * FROM department`), (err: Error, result: QueryResult) => {
          if (err) {
            console.log(err);
          }

          else {
            console.log(`${result.rows}`);

          }
        }
    }

    if (answers.choices === 'View All Roles') {
    pool.query(`SELECT * FROM role`), (err: Error, result: QueryResult) => {
      if (err) {
        console.log(err);
      }

      else {
        console.log(`${result.rows}`);

      }
    }

  }

  if (answers.choices === 'View All Employee') {
    pool.query(`SELECT * FROM employee`), (err: Error, result: QueryResult) => {
      if (err) {
        console.log(err);
      }

      else {
        console.log(`${result.rows}`);

      }
    }

  }


  if (answers.choices === 'Add a Department') {

    inquirer
      .prompt([

        {
          type: 'input',
          name: 'newDepartment',
          message: 'Add Name of Department',

        }

      ])


    pool.query(`INSERT INTO department (id, name) VALUES $(answers.newDepartment`), (err: Error, result: QueryResult) => {
      if (err) {
        console.log(err);
      }

      else {
        console.log(`${result.rows}`);

      }
    }

  }


  if (answers.choices === 'Add a Role') {

    inquirer
      .prompt([

        {
          type: 'input',
          name: 'newRoleName',
          message: 'Name of Role',

        }



        {

          type: 'input',
          name: 'salary',
          message: 'Salary for Role',


        }

        {

          type: 'input',
          name: 'Department',
          message: 'Department for Role',


        }




      ])


    pool.query(`INSERT INTO role (id, name, salary, department) VALUES $(answers.newRoleName, answers.salary, answers.department`), (err: Error, result: QueryResult) => {
      if (err) {
        console.log(err);
      }

      else {
        console.log(`${result.rows}`);

      }
    }

  }


  if (answers.choices === 'Add an') {

    inquirer
      .prompt([

        {
          type: 'input',
          name: 'newRoleName',
          message: 'Name of Role',

        }



        {

          type: 'input',
          name: 'salary',
          message: 'Salary for Role',


        }

        {

          type: 'input',
          name: 'Department',
          message: 'Department for Role',


        }




      ])


    pool.query(`INSERT INTO department (id, name) VALUES $(answers.newDepartment`), (err: Error, result: QueryResult) => {
      if (err) {
        console.log(err);
      }

      else {
        console.log(`${result.rows}`);

      }
    }

  }









}










  // });


}










// Hardcoded query: DELETE FROM course_names WHERE id = 3;
// pool.query(`DELETE FROM course_names WHERE id = $1`, [3], (err: Error, result: QueryResult) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(`${result.rowCount} row(s) deleted!`);
//   }
// });

// Query database
// pool.query('SELECT * FROM course_names', (err: Error, result: QueryResult) => {
//   if (err) {
//     console.log(err);
//   } else if (result) {
//     console.log(result.rows);
//   }
// });

// // Default response for any other request (Not Found)
// app.use((_req, res) => {
//   res.status(404).end();
// });

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
