require('dotenv').config()

const {CONNECTION_STRING} = process.env

const Sequelize = require('sequelize')

const sequelize = new Sequelize(CONNECTION_STRING,{
    dialect: 'postgres',
    dialectOptions: {
        ssl:{
            rejecUnauthorized: false
        }
    }
})

let nextEmp = 5

module.exports = {

    getAllClients: (req,res) =>{
        let query =`
                    SELECT *
                    FROM cc_users u
                    JOIN cc_clients c
                    ON u.user_id = c.user_id
                    `
        sequelize.query(query).then(dbRes => res.status(200).send(dbRes[0])).catch(err => console.log(err))
    },

    getPendingAppointments: (req,res) =>{
        let query =`
                    SELECT *
                    FROM cc_appointments
                    WHERE approved = false
                    ORDER BY date DESC;
                    `
        sequelize.query(query).then(dbRes => res.status(200).send(dbRes[0])).catch(err => console.log(err))

    },


    getUpcomingAppointments: (req, res) => {
        sequelize.query(`select a.appt_id, a.date, a.service_type, a.approved, a.completed, u.first_name, u.last_name 
        from cc_appointments a
        join cc_emp_appts ea on a.appt_id = ea.appt_id
        join cc_employees e on e.emp_id = ea.emp_id
        join cc_users u on e.user_id = u.user_id
        where a.approved = true and a.completed = false
        order by a.date desc;`)
            .then(dbRes => res.status(200).send(dbRes[0]))
            .catch(err => console.log(err))
    },

    approveAppointment: (req, res) => {
        let {apptId} = req.body
        
        query = `update cc_appointments set approved = true
        where appt_id = ${apptId};

        insert into cc_emp_appts (emp_id, appt_id)
        values (${nextEmp}, ${apptId}),
        (${nextEmp + 1}, ${apptId});
        `
        sequelize.query(`
                        UPDATE cc_appointments
                        SET approved = true
                        WHERE appt_id = ${apptId};
        
                        INSERT INTO cc_emp_appts 
                        SET approved = true
                        WHERE appt_id = 
                        (emp_id, appt_id)
                        VALUES (${nextEmp}, ${apptId}),
                                (${nextEmp + 1}, ${apptId});
                        `)
            .then(dbRes => {
                res.status(200).send(dbRes[0])
                nextEmp += 2
            })
            .catch(err => console.log(err))
    },

    getPastAppointments: (req, res) =>{

        let query = `
                    SELECT u.first_name, u.last_name, 
                            a.appt_id, a.date, a.service_type, a.notes
                    FROM cc_appointments a
                    JOIN cc_emp_appts ea on a.appt_id = ea.appt_id
                    JOIN cc_employees e on e.emp_id = ea.emp_id
                    JOIN cc_users u on e.user_id = u.user_id
                    WHERE a.approved = true and a.completed = true
                    ORDER BY a.date desc;                    
                    `

                    sequelize.query(query).then(dbRes => res.status(200).send(dbRes[0])).catch(err => console.log(err))
    },

    completeAppointment: (req, res) =>{
        //pulling id being sent from data
        const {apptId} = req.body;

        let query =`UPDATE cc_appointments
                    SET completed=true
                    WHERE appt_id = ${apptId};
                    
                    `
        sequelize.query(query).then(dbRes => res.status(200).send(dbRes[0])).catch(err => console.log(err))
    }



}

