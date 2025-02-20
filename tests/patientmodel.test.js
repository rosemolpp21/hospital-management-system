const db = require('../config/db-connect');
const patientmodel = require('../model/patient');
jest.mock('../config/db-connect', () => ({
    query: jest.fn(),
}));
describe('authenticationModel', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('addpatient', () => {
        it('should insert a new patient into the database', () => {
            const values = ['John', 'Peter', '9264977850', 'Male', 22, 'Thrissur'];
            const callback = jest.fn();
            patientmodel.addpatient(values, callback);
            expect(db.query).toHaveBeenCalledWith(`INSERT INTO patient (first_name, last_name, phone_no, gender, age, address, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())`, values, callback);
        });
    });
    describe('update', () => {
        it('update db with values', () => {
            const updates = ['first_name = ?', 'last_name = ?'];
            const values = ['John', 'peter'];
            const ID = 1;
            const callback = jest.fn();
            patientmodel.updatepatient(ID, updates, values, callback);
            expect(db.query).toHaveBeenCalledWith(`UPDATE patient SET ${updates.join(', ')} WHERE ID = ?`, [...values, ID], callback);
        });
    });
    describe('delete', () => {
        it('delete db rows', () => {
            const ID = 1;
            const callback = jest.fn();
            patientmodel.deletepatient(ID, callback);
            expect(db.query).toHaveBeenCalledWith(`DELETE FROM patient WHERE ID = ?`, [ID], callback);
        });
    });
});
