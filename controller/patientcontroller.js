const patientmodel=require('../model/patient');
const patientcontroller={
    addpatient:(req, res) => {
        const ID = req.body.ID;
        const first_name = req.body.first_name;
        const last_name = req.body.last_name;
        const phone_no = req.body.phone_no;
        const gender = req.body.gender;
        const age = req.body.age;
        const address = req.body.address;
        const data=[ID,first_name,last_name,phone_no,gender,age,address];
        if (!ID || !first_name || !last_name || !phone_no || !gender || !age || !address) {
            return res.status(500).send('all fields required');
        }
        patientmodel.addpatient(data,(err, result) => {
            if (err) {
                return res.status(500).send('error in inserting patient');
            }
            res.status(200).send('patient added susccesfully');
        })
    
    },
    updatepatient:(req, res) => {
        const ID = req.params.id;
        const first_name = req.body.first_name;
        const last_name = req.body.last_name;
        const phone_no = req.body.phone_no;
        const gender = req.body.gender;
        const age = req.body.age;
        const address = req.body.address;
        const updatefield = [];
        const values = [];
        if (first_name != undefined) {
            updatefield.push('first_name=?');
            values.push(first_name);
        }
        if (last_name != undefined) {
            updatefield.push('last_name=?');
            values.push(last_name);
        }
        if (phone_no != undefined) {
            updatefield.push('phone_no=?');
            values.push(phone_no);
        }
        if (gender != undefined) {
            updatefield.push('gender=?');
            values.push(gender);
        }
        if (age != undefined) {
            updatefield.push('age=?');
            values.push(age);
        }
        if (address != undefined) {
            updatefield.push('address=?');
            values.push(address);
        }
        if (updatefield.length === 0) {
            return res.status(500).send("minimum 1 field required");
    
        }
        values.push(ID);
        patientmodel.updatepatient(ID,updatefield,values,(err, result) => {
            if (err) {
                return res.status(500).send('error in updating patient');
            }
            res.status(200).send(`updated data successfully`);
        })
    },
    deletepatient:(req, res) => {
        const ID = req.params.id;
        patientmodel.deletepatient(ID,(err, result) => {
            if (err) {
                return res.status(500).send('error in deleting patient');
            }
            res.status(200).send(`patient with ID: ${ID} deleted from database`);
        });
    }
      
}
module.exports=patientcontroller;