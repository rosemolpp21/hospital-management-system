const db = require('../config/db-connect');
const authenticationModel = require('../model/authenticationModel');
jest.mock('../config/db-connect', () => ({
    query: jest.fn(),
}));

describe('authenticationModel', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('register', () => {
        it('insert a new patient into the database', () => {
            const values = ['John', 'peter', 'Male', 22, '9260067890', 'Thrissur', 'john1.peter@example.com', 'password'];
            const callback = jest.fn();
            authenticationModel.register(values, callback);
            expect(db.query).toHaveBeenCalledWith(`INSERT INTO patient(first_name,last_name,gender,age,phone_no,address,email,password, created_at) values(?,?,?,?,?,?,?,?,NOW())`,values,callback);
        });
    });
    describe('loginuser', () => {
        it('fetch a patient by email', () => {
            const values = ['john1.peter@example.com'];
            const callback = jest.fn();
            authenticationModel.loginuser(values, callback);
            expect(db.query).toHaveBeenCalledWith(`SELECT * FROM patient WHERE email=?`,values,callback);
        });
    });
    describe('loginadmin', () => {
        it('fetch an admin by email', () => {
            const values = ['admin@example.com'];
            const callback = jest.fn();
            authenticationModel.loginadmin(values, callback);
            expect(db.query).toHaveBeenCalledWith(`SELECT * FROM staff WHERE email=?`, values, callback);
        });
    });
    describe('bookappointment', () => {
        it('insert a new appointment into the database', () => {
            const values = [1, 2, 'scheduled', '2023-12-01', '10:00 AM'];
            const callback = jest.fn();
            authenticationModel.bookappointment(values, callback);
            expect(db.query).toHaveBeenCalledWith(`INSERT INTO appointment(patient_id,doctor_id,status,appointment_date,scheduled_time,created_at) values(?,?,?,?,?,NOW())`,values,callback);
        });
    });
    describe('viewappointmentdetails', () => {
        it('should fetch all appointments', () => {
            const callback = jest.fn();
            authenticationModel.viewappointmentdetails(callback);
            expect(db.query).toHaveBeenCalledWith(`SELECT * FROM appointment`,callback);
        });
    });
    describe('viewuserappointmentDetails', () => {
        it('fetch appointments for a specific patient', () => {
            const values = ['john@example.com'];
            const callback = jest.fn();
            authenticationModel.viewuserappointmentDetails(values, callback);
            expect(db.query).toHaveBeenCalledWith(`SELECT * FROM appointment WHERE patient_id=(SELECT ID FROM patient WHERE email=?)`,values,callback);
        });
    });
});
