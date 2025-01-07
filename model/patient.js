const db = require('../config/db-connect');
const patientmodel={
    addpatient:(values,callback)=>{
        const query=`INSERT INTO patient (ID, first_name, last_name, phone_no, gender, age, address, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`;
       db.query(query,values,callback);
    },
    updatepatient:(ID,updates,values,callback)=>{
        const query=`UPDATE patient SET ${updates.join(', ')} WHERE ID = ?`;
        db.query(query,values,callback);
    },
    deletepatient:(ID,callback)=>{
        const query=`DELETE FROM patient WHERE ID = ?`;
        db.query(query,[ID],callback);
    }
}
module.exports=patientmodel;