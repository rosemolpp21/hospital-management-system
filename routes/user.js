const express = require('express');
const router = express.Router();
const db = require('../config/db-connect');
router.post('/', (req, res) => {
    const ID = req.body.ID;
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const phone_no = req.body.phone_no;
    const gender = req.body.gender;
    const age = req.body.age;
    const address = req.body.address;
    if (!ID || !first_name || !last_name || !phone_no || !gender || !age || !address) {
        return res.status(500).send('all fields required');
    }
    db.query(`INSERT INTO patient (ID, first_name, last_name, phone_no, gender, age, address, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`, [ID, first_name, last_name, phone_no, gender, age, address], (err, result) => {
        if (err) {
            return res.status(500).send('error in inserting patient');
        }
        res.status(200).send('patient added susccesfully');
    });
});


router.put('/:id', (req, res) => {
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
    db.query(`UPDATE patient SET ${updatefield.join(', ')} WHERE ID = ?`, values, (err, result) => {
        if (err) {
            return res.status(500).send('error in updating patient');
        }
        res.status(200).send(`updated data successfully`);
    });
});

router.delete('/:id', (req, res) => {
    const ID = req.params.id;
    db.query(`DELETE FROM patient WHERE ID = ?`, [ID], (err, result) => {
        if (err) {
            return res.status(500).send('error in deleting patient');
        }
        res.status(200).send(`patient with ID: ${ID} deleted from database`);
    });
});
module.exports = router;
