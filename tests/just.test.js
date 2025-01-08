const patientcontroller = require('../controller/patientcontroller');
const patientmodel = require('../model/patient');
jest.mock('../model/patient');
describe('Patient Controller', () => {
    describe('addpatient', () => {
        it('return error if  fields are missing', () => {
            const req = {
                body: {
                    first_name: 'John',
                    last_name: 'Peter',
                    phone_no: '9234567890',
                    gender: 'Male',
                    age: 22,
                }, 
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
            };
            patientcontroller.addpatient(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith('all fields required');
        });

        it('all dat filled case', () => {
            const req = {
                body: {
                    ID: 1,
                    first_name: 'John',
                    last_name: 'Peter',
                    phone_no: '9234567890',
                    gender: 'Male',
                    age: 22,
                    address: 'Thrissur',
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
            };
            patientmodel.addpatient.mockImplementation((data, callback) => {
                callback(null, { affectedRows: 1 });
            });
            patientcontroller.addpatient(req, res);
            expect(patientmodel.addpatient).toHaveBeenCalledWith(
                [1, 'John', 'Peter', '9234567890', 'Male', 22, 'Thrissur'],
                expect.any(Function)
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith('patient added susccesfully');
        });
        it('should handle database errors', () => {
            const req = {
                body: {ID: 1,first_name: 'John',last_name: 'Peter',phone_no: '9234567890',gender: 'Male',age: 22,address: 'Thrissur',},
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
            };
            patientmodel.addpatient.mockImplementation((data, callback) => {
                callback(new Error('Database error'));
            });
            patientcontroller.addpatient(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith('error in inserting patient');
        });
    });

    describe('updatepatient', () => {
        it('should return 500 if no fields are provided', () => {
            const req = { params: { id: 1 }, body: {} };
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
            };
            patientcontroller.updatepatient(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith('minimum 1 field required');
        });

        it('should update data if correct values given', () => {
            const req = {
                params: { id: 1 },
                body: { first_name: 'John' },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
            };
            patientmodel.updatepatient.mockImplementation((id, updates, values, callback) => {callback(null, { affectedRows: 1 });});
            patientcontroller.updatepatient(req, res);
            expect(patientmodel.updatepatient).toHaveBeenCalledWith(1,['first_name=?'],['John', 1],expect.any(Function));
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith('updated data successfully');
        });
    });

    describe('deletepatient', () => {
        it('should call patientmodel.deletepatient with correct ID', () => {
            const req = { params: { id: 1 } };
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
            };
            patientmodel.deletepatient.mockImplementation((id, callback) => {callback(null, { affectedRows: 1 });});
            patientcontroller.deletepatient(req, res);
            expect(patientmodel.deletepatient).toHaveBeenCalledWith(1,expect.any(Function));
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith('patient with ID: 1 deleted from database');
        });
    });
});

