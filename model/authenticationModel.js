const db = require('../config/db-connect');
const authenticationmodel={
    register:(values,callback)=>{
        const query=`INSERT INTO patient(first_name,last_name,gender,age,phone_no,address,email,password, created_at) values(?,?,?,?,?,?,?,?,NOW())`;
        db.query(query,values,callback);
    },
    loginuser:(values,callback)=>{
        const query=`SELECT * FROM patient WHERE email=?`;
        db.query(query,values,callback);
    },
    loginadmin:(values,callback)=>{
        const query=`SELECT * FROM staff WHERE email=?`;
        db.query(query,values,callback);
    },
    bookappointment:(values,callback)=>{
        const query=`INSERT INTO appointment(patient_id,doctor_id,status,appointment_date,scheduled_time,created_at) values(?,?,?,?,?,NOW())`;
        db.query(query,values,callback);
    },
    viewappointmentdetails:(callback)=>{
        const query=`SELECT * FROM appointment`;
        db.query(query,callback);
    },
    viewuserappointmentDetails:(values,callback)=>{
        const query=`SELECT * FROM appointment WHERE patient_id=(SELECT ID FROM patient WHERE email=?)`;
        db.query(query,values,callback);
    }
};
module.exports=authenticationmodel;