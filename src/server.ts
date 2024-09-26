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

async function departmentList () {
  return new Promise(resolve, reject)=>

  
}

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

  //presents entire employee table
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

//updates row table
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

        //this needs to be a list of choices from department table
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

    if (answers.choices === 'Add an Employee') {

      inquirer
        .prompt([
  
          {
            type: 'input',
            name: 'firstName',
            message: 'Employees First Name',
  
          }
  
  
  
          {
  
            type: 'input',
            name: 'lastName',
            message: 'Employee Last Name',
  
  
          }
  
          {
  
            type: 'input',
            name: 'employeeRole',
            message: 'Employee Role',
  
  
          }

          {
  
            type: 'input',
            name: 'employeeManager',
            message: 'Employee Manager',
  
  
          }
  
  
  
  
        ])
  
  
      pool.query(`INSERT INTO employee (id, firstname, last_name, role, employee manager) VALUES $(answers.firstName, answers.lastName, answers.employeeRole, answers.employeeManager`), (err: Error, result: QueryResult) => {
        if (err) {
          console.log(err);
        }
  
        else {
          console.log(`${result.rows}`);
  
        }
      }
  
    }
  
  //need to present list of choices from employee table for choices--after selection 
    if (answers.choices === 'Update an Employee Role') {
  
      inquirer
        .prompt([
  
          {
            type: 'list',
            name: 'selectEmployee',
            message: 'Select an Employee',
            choices: pool.query(SELECT first_name, last_name FROM employee)
  
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
