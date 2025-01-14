const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authentication = require('../controller/authenticationcontroller');
const authenticationmodel = require('../model/authenticationModel');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../model/authenticationModel');
describe('Authentication tests', () => {
    let req, res;
    beforeEach(() => {
        req = { body: {}, user: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
            json: jest.fn(),
        };
    });
    describe('register', () => {
        it('should return 500 if required fields are missing', async () => {
            req.body = {};
            await authentication.register(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith('all fields required');
        });
        it('retun user is added successfully message', async () => {
            req.body = {
                first_name: 'John',
                last_name: 'peter',
                gender: 'Male',
                age: 22,
                phone_no: '9234567890',
                address: 'thrissur',
                email: 'john@gmail.com',
                password: 'password',
            };
            bcrypt.hash.mockResolvedValue('hashedpassword');
            authenticationmodel.register.mockImplementation((data, callback) => callback(null));
            await authentication.register(req, res);
            expect(bcrypt.hash).toHaveBeenCalledWith('password', 10);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.send).toHaveBeenCalledWith('user added successfully');
        });
        it('return error in inserting user msg', async () => {
            req.body = {
                first_name: 'John',
                last_name: 'peter',
                gender: 'Male',
                age: 22,
                phone_no: '9234567890',
                address: 'thrissur',
                email: 'john@gmail.com',
                password: 'password',
            };
            bcrypt.hash.mockResolvedValue('hashedpassword');
            authenticationmodel.register.mockImplementation((data, callback) => callback(new Error('DB error')));
            await authentication.register(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith('error in inserting user');
        });
    });
    describe('loginuser', () => {
        it('return error when email or password is missing', async () => {
            req.body = {};
            await authentication.loginuser(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith('Email and password are required');
        });
        it('return error email is not registered', async () => {
            req.body = { email: 'john@gmail.com', password: 'password' };
            authenticationmodel.loginuser.mockImplementation((email, callback) => callback(null, []));
            await authentication.loginuser(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith('entered mail is not registered');
        });
        it('return error if password is invalid', async () => {
            req.body = { email: 'john@gmail.com', password: 'wrongpassword' };
            const user = { email: 'john@gmail.com', password: 'hashedpassword' };
            authenticationmodel.loginuser.mockImplementation((email, callback) => callback(null, [user]));
            bcrypt.compare.mockResolvedValue(false);
            await authentication.loginuser(req, res);
            expect(bcrypt.compare).toHaveBeenCalledWith('wrongpassword', 'hashedpassword');
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.send).toHaveBeenCalledWith('invalid password enter correct password');
        });

        it('return error with accessToken if login is successful', async () => {
            req.body = { email: 'john@gmail.com', password: 'password' };
            const user = { email: 'john@gmail.com', password: 'hashedpassword' };
            authenticationmodel.loginuser.mockImplementation((email, callback) => callback(null, [user]));
            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue('token');
            await authentication.loginuser(req, res);
            expect(jwt.sign).toHaveBeenCalledWith({ email: 'john@gmail.com', role: 'user' },process.env.ACCESS_TOKEN_SECRET,{ expiresIn: '1h' });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'login successful', accessToken: 'token' });
        });
    });
    describe('loginadmin', () => {
        it('return error if email or password is missing', async () => {
            req.body = {};
            await authentication.loginadmin(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith('email and password are required');
        });
        it('return error if admin is not found', async () => {
            req.body = { email: 'admin@gmail.com', password: 'password' };
            authenticationmodel.loginadmin.mockImplementation((email, callback) => callback(null, []));
            await authentication.loginadmin(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith('Admin is not found');
        });
        it('return error if user role is not admin', async () => {
            req.body = { email: 'user@gmail.com', password: 'password123' };
            const admin = { email: 'user@gmail.com', password: 'hashedpassword', role: 'user' };
            authenticationmodel.loginadmin.mockImplementation((email, callback) => callback(null, [admin]));
            await authentication.loginadmin(req, res);
            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.send).toHaveBeenCalledWith('you odnt have permission to access');
        });
        it('return error if password is incorrect', async () => {
            req.body = { email: 'admin@gmail.com', password: 'wrongpassword' };
            const admin = { email: 'admin@gmail.com', password: 'hashedpassword', role: 'admin' };
            authenticationmodel.loginadmin.mockImplementation((email, callback) => callback(null, [admin]));
            bcrypt.compare.mockResolvedValue(false);
            await authentication.loginadmin(req, res);
            expect(bcrypt.compare).toHaveBeenCalledWith('wrongpassword', 'hashedpassword');
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.send).toHaveBeenCalledWith('Invalid password or mailid');
        });
        it('return success code if admin login is successful', async () => {
            req.body = { email: 'admin@gmail.com', password: 'password123' };
            const admin = { email: 'admin@gmail.com', password: 'hashedpassword', role: 'admin' };
            authenticationmodel.loginadmin.mockImplementation((email, callback) => callback(null, [admin]));
            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue('token');
            await authentication.loginadmin(req, res);
            expect(jwt.sign).toHaveBeenCalledWith(
                { email: 'admin@gmail.com', role: 'admin' },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '1h' }
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Admin login successful', accessToken: 'token' });
        });
    });
    describe('viewappointmentdetails', () => {
        it('return error if user role is not admin', async () => {
            req.user.role = 'user';
            await authentication.viewappointmentdetails(req, res);
            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.send).toHaveBeenCalledWith('only admin can view appointment details');
        });
        it('return 200 with appointment details if user is admin', async () => {
            req.user.role = 'admin';
            const appointments = [
                { id: 1, patient: 'John peter', doctor: 'Dr.name', status: 'Confirmed' },
                { id: 2, patient: 'Rose Peter', doctor: 'Dr.name', status: 'Pending' },
            ];
            authenticationmodel.viewappointmentdetails.mockImplementation((callback) => callback(null, appointments));
            await authentication.viewappointmentdetails(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith(appointments);
        });
        it('return error code if there is an error in fetching appointment details', async () => {
            req.user.role = 'admin';
            authenticationmodel.viewappointmentdetails.mockImplementation((callback) => callback(new Error('DB error')));
            await authentication.viewappointmentdetails(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith('error in viewing appointment details');
        });
    });
    describe('viewuserappointmentdetails',()=>{
        it('return error code if user role is not admin', async () => {
            req.user.role = 'user11';
            await authentication.viewuserappointmentDetails(req, res);
            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.send).toHaveBeenCalledWith('role is not matching user');
        });
        it('return error code if there is an error in fetching user details', () => {
            req.user.role = 'user';
            authenticationmodel.viewuserappointmentDetails.mockImplementation((email, callback) => {
                callback(new Error('DB error'));
            });
            authenticationmodel.viewuserappointmentDetails(req.user.email, (err, results) => {
                expect(err).toBeInstanceOf(Error);
                expect(err.message).toBe('DB error');
            });
        });
        
        it('return error code if there is an error in fetching user details', async () => {
            req.user.role = 'user';
            authenticationmodel.viewuserappointmentDetails = jest.fn().mockRejectedValue(new Error('DB error'));
        
            await expect(authenticationmodel.viewuserappointmentDetails(req.user.email)).rejects.toThrow('DB error');
        });
        
        it('returns user details', async () => {
            req.user.role = 'user';
            req.user.email = 'john1.peter@gmail.com';
            const userdetails = [{ id: 1, patient: 1, doctor: 1, status: 'Confirmed' }];
            authenticationmodel.viewuserappointmentDetails = jest.fn().mockResolvedValue(userdetails);
            const result = await authenticationmodel.viewuserappointmentDetails(req.user.email);
            expect(result).toEqual(userdetails);
        });
        
    })
    describe('bookappointment', () => {
        it('return error code if user role is not authorized', async () => {
            req.user.role = 'guest';
            await authentication.bookappointment(req, res);
            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.send).toHaveBeenCalledWith('Access denied');
        });
        it('appointment is booked successfully', async () => {
            req.user.role = 'user';
            req.body = {
                patient_id: 1,
                doctor_id: 2,
                status: 'confirmed',
                appointment_date: '2025-01-01',
                scheduled_time: '10:00 AM',
            };
            authenticationmodel.bookappointment.mockImplementation((data, callback) => callback(null));
            await authentication.bookappointment(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith('appointment booked successfully');
        });
        it('ERROR IN booking appointment', async () => {
            req.user.role = 'user';
            req.body = {
                patient_id: 1,
                doctor_id: 2,
                status: 'confirmed',
                appointment_date: '2025-01-01',
                scheduled_time: '10:00 AM',
            };
            authenticationmodel.bookappointment.mockImplementation((data, callback) => callback(new Error('DB error')));
            await authentication.bookappointment(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith('error in booking appointment');
        });
    });
});

