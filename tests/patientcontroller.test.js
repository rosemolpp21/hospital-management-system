const patientmodel = require('../model/patient');
const patientcontroller = require('../controller/patientcontroller'); 

jest.mock('../model/patient', () => ({
    updatepatient: jest.fn(), 
}));

describe('updatepatient', () => {
    afterEach(() => {
        jest.clearAllMocks(); 
    });

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

    it('should update data if correct values are given', () => {
        const req = {
            params: { id: 1 },
            body: { first_name: 'John' },
        }; 
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        patientmodel.updatepatient.mockImplementation((id, updates, values, callback) => {
            callback(null, { affectedRows: 1 });
        });
        patientcontroller.updatepatient(req, res);
        expect(patientmodel.updatepatient).toHaveBeenCalledWith(1,['first_name=?'],['John',1],expect.any(Function));
        expect(res.status).toHaveBeenCalledWith(200); 
        expect(res.send).toHaveBeenCalledWith('updated data successfully');
    });

    it('should return 404 if no rows are affected', () => {
        const req = {
            params: { id: 1 },
            body: { first_name: 'John' },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        patientmodel.updatepatient.mockImplementation((id, updates, values, callback) => {
            callback(null, { affectedRows: 0 });
        });

        patientcontroller.updatepatient(req, res);
        expect(patientmodel.updatepatient).toHaveBeenCalledWith(1,['first_name=?'],['John',1],expect.any(Function));
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith('no data found to update');
    });

    it('should return 500 if an error occurs in the model', () => {
        const req = {
            params: { id: 1 },
            body: { first_name: 'John' },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        patientmodel.updatepatient.mockImplementation((id, updates, values, callback) => {callback(new Error('Database error'), null);});
        patientcontroller.updatepatient(req, res);
        expect(patientmodel.updatepatient).toHaveBeenCalledWith(1,['first_name=?'],['John',1],expect.any(Function));
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith('error in updating patient'); 
    });
});
