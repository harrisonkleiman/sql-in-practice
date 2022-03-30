//require in the dotenv package and call the config method
require('dotenv').config()

//destructure CONNECTION_STRING from the .env file
const { CONNECTION_STRING } = process.env

//require sequelize pckg, save to variable
const Sequelize = require('sequelize')

//init new instance of sequelize
const sequelize = new Sequelize(CONNECTION_STRING, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false
    }
  }
})

let nextEmp = 5

module.exports = {
  getUpcomingAppointments: (req, res) => {
    sequelize
      .query(
        `select a.appt_id, a.date, a.service_type, a.approved, a.completed, u.first_name, u.last_name 
        from cc_appointments a
        join cc_emp_appts ea on a.appt_id = ea.appt_id
        join cc_employees e on e.emp_id = ea.emp_id
        join cc_users u on e.user_id = u.user_id
        where a.approved = true and a.completed = false
        order by a.date desc;`
      )
      .then((dbRes) => res.status(200).send(dbRes[0]))
      .catch((err) => console.log(err))
  },

  approveAppointment: (req, res) => {
    let { apptId } = req.body

    sequelize
      .query(
        `*****YOUR CODE HERE*****
        
        insert into cc_emp_appts (emp_id, appt_id)
        values (${nextEmp}, ${apptId}),
        (${nextEmp + 1}, ${apptId});
        `
      )
      .then((dbRes) => {
        res.status(200).send(dbRes[0])
        nextEmp += 2
      })
      .catch((err) => console.log(err))
  },

  // Using sequelize.query query your database for all the columns in both cc_users and cc_clients joining them where the user_id column matches
  getAllClients: (req, res) => {
    sequelize
      .query(
        `
        SELECT  * FROM cc_users AS c
        JOIN cc_clients AS u ON c.user_id = u.user_id
      `
      )
      .then((dbRes) => res.status(200).send(dbRes[0]))
      .catch((err) => console.log(err))
  },
  //  In controller.js, write a new function called getPendingAppointments
  // query your database for all appointments that are not approved (approved = false) and order them by date with the most recent dates at the top
  getPendingAppointments: (req, res) => {
    sequelize
      .query(
        `
      SELECT * FROM cc_appointments AS a
      WHERE a.approved = false
      ORDER BY DATES DESC
    `
      )
      .then((dbRes) => res.status(200).send(dbRes[0]))
      .catch((err) => console.log(err))
  },
   // In controller.js, write a new function called getPastAppointments
  
  // query your database for the following columns from their respective tables cc_appointments: appt_id, date, service_type, notes. cc_users: first_name, last_name.
  
  //Reference the getUpcomingAppointments function to see how to join all the information together(you’ll need all the same tables again). Make sure to select only rows where both the approved and completed values are true.And order the results by date with the most recent at the top.
  getPastAppointments: (req, res) => {
    sequelize
      .query(
        `
      SELECT * FROM cc_appointments AS a
      JOIN cc_users AS u ON a.user_id = u.user_id
      WHERE a.approved = true AND a.completed = true
      ORDER BY DATES DESC
    `
      )
      .then((dbRes) => res.status(200).send(dbRes[0]))
      .catch((err) => console.log(err))
  }
}
