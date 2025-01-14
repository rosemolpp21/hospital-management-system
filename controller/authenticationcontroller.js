const authenticationmodel= require('../model/authenticationModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const authentication = {
    register: (req, res) => {
        const first_name = req.body.first_name;
        const last_name = req.body.last_name;
        const gender=req.body.gender;
        const age=req.body.age;
        const phone_no=req.body.phone_no;
        const address=req.body.address;
        const email = req.body.email;
        const password = req.body.password;
        const hashedpassword = bcrypt.hash(password, 10);
        const data=[first_name,last_name,gender,age,phone_no,address,email,hashedpassword ];
        if (!first_name||!last_name||!gender||!age||!phone_no||!address||!email || !password) {
            return res.status(500).send('all fields required');
        }
        authenticationmodel.register(data,(err)=>{
            if (err) {
                return res.status(500).send('error in inserting user');
            }
            else{
                res.status(201).send('user added successfully');  
            }
            
        });
    },
    loginuser: (req, res) => {
        const email = req.body.email;
        const password = req.body.password;
        if (!email || !password) {
            return res.status(400).send('Email and password are required');
        }
        authenticationmodel.loginuser([email],async(err, results) => {
            if (err) {
                return res.status(500).send('error in login');
            }
            if (results.length===0) {
                return res.status(404).send('entered mail is not registered');
            }
            const user = results[0];
            const checkpassword =await bcrypt.compare(password, user.password);
            if (!checkpassword) {
                return res.status(401).send('invalid password enter correct password');
            }
            const accessToken = jwt.sign({ email: user.email,role:'user' }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
            res.status(200).json({ message: 'login successful', accessToken});
        });
    },
    loginadmin:(req, res) => {
        const email = req.body.email;
        const password = req.body.password;
        if (!email || !password) {
            return res.status(400).send('email and password are required');
        }
        authenticationmodel.loginadmin([email],async (err, results) => {
            if (err) {
                return res.status(500).send('error during login');
            }
            if (results.length === 0) {
                return res.status(404).send('Admin is not found');
            }
            const admin = results[0];
            if (admin.role !== 'admin') {
                return res.status(403).send('you odnt have permission to access');
            }
            const match =await bcrypt.compare(password, admin.password);
            if (!match) {
                return res.status(401).send('Invalid password or mailid');
            }
            const accessToken = jwt.sign({ email: admin.email, role: 'admin' }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
            res.status(200).json({ message: 'Admin login successful', accessToken });
        });
    },
    bookappointment:(req, res) => {
        const patient_id = req.body.patient_id;
        const doctor_id = req.body.doctor_id;
        const status = req.body.status;
        const appointment_date = req.body.appointment_date;
        const scheduled_time = req.body.scheduled_time;
        const data=[patient_id,doctor_id,status,appointment_date,scheduled_time];
        if(req.user.role !== 'user'&&req.user.role !== 'admin'){
            return res.status(403).send('Access denied');
        }
        authenticationmodel.bookappointment(data,(err)=>{
            if(err){
              return res.status(500).send('error in booking appointment');
            }
            res.status(200).send('appointment booked successfully');
        });     
    },
    viewappointmentdetails:(req, res) => {
        if(req.user.role !== 'admin'){
            return res.status(403).send('only admin can view appointment details');
        }
        authenticationmodel.viewappointmentdetails((err,results)=>{
            if(err){
                return res.status(500).send('error in viewing appointment details');
            }
            res.status(200).send(results);
        });
    },
    viewuserappointmentDetails:(req, res) => {
        if(req.user.role !== 'user'){
            return res.status(403).send('role is not matching user');
        }
        authenticationmodel.viewuserappointmentDetails([req.user.email],(err,results)=>{
            if(err){
                return res.status(500).send('error in viewing appointment details');
            }
            res.status(200).send(results);
        });
    },
}
module.exports=authentication;