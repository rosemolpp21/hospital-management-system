const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const authenticationmodel = require('../model/authenticationModel');
const authentication = require('../controller/authenticationcontroller');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../model/authenticationModel');
describe('Authentication Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('register', () => {
        it('register a new user successfully', async () => {
            bcrypt.hash.mockResolvedValue('hashedPassword');
            authenticationmodel.register.mockImplementation((data, callback) => callback(null));
            const req = {
                body: {first_name: 'John',last_name: 'peter',gender: 'Male',age: 22,phone_no: '9284361890',address: 'thrissur',email: 'john1.peter@example.com',password: 'hashedPassword',},
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
            };

            await authentication.register(req, res);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.send).toHaveBeenCalledWith('user added successfully');
        });

        it('return error code if fields are missing', async () => {
            const req = { body: { email: 'john@example.com' } }; 
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
            };

            await authentication.register(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith('all fields required');
        });

        it('return error code on database error', async () => {
            bcrypt.hash.mockResolvedValue('hashedPassword');
            authenticationmodel.register.mockImplementation((data, callback) => callback(new Error()));

            const req = {
                body: {
                    first_name: 'John',last_name: 'peter',gender: 'Male',age: 22,phone_no: '9284361890',address: 'thrissur',email: 'john1.peter@example.com',password: 'password',
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
            };
            await authentication.register(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith('error in inserting user');
        });
    });

    describe('loginuser', () => {
        it('return success code if login a user successfully', async () => {
            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue('testToken');
            authenticationmodel.loginuser.mockImplementation((values, callback) => callback(null, [{ email: 'john1.peter@example.com', password: 'hashedPassword' }]));
            const req = { body: { email: 'john1.peter@example.com', password: 'password123' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            await authentication.loginuser(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'login successful', accessToken: 'testToken' });
        });
        it('return error code if user is not found', async () => {
            authenticationmodel.loginuser.mockImplementation((values, callback) => callback(null, []));
            const req = { body: { email: 'check@example.com', password: 'password123' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
            };

            await authentication.loginuser(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith('entered mail is not registered');
        });
        it('return error code if password is invalid', async () => {
            bcrypt.compare.mockResolvedValue(false);
            authenticationmodel.loginuser.mockImplementation((values, callback) =>callback(null, [{ email: 'john1.pet@example.com', password: 'hashedPassword' }]));
            const req = { body: { email: 'john1.peter@example.com', password: 'wrongpassword' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
                json: jest.fn(),
            };
            await authentication.loginuser(req, res);
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.send).toHaveBeenCalledWith('invalid password enter correct password');
        });
        
    });

    describe('bookappointment', () => {
        it('return suuccess code and book an appointment successfully', async () => {
            authenticationmodel.bookappointment.mockImplementation((data, callback) => callback(null));
            const req = {
                user: { role: 'user' },
                body: {
                    patient_id: 1,
                    doctor_id: 2,
                    status: 'pending',
                    appointment_date: '2025-01-15',
                    scheduled_time: '10:00 AM',
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
            };

            await authentication.bookappointment(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith('appointment booked successfully');
        });
        it('return error code if role is not user or admin', async () => {
            const req = { user: { role: 'guest' }, body: {} };
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
            };
            await authentication.bookappointment(req, res);
            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.send).toHaveBeenCalledWith('Access denied');
        });
    });
});


