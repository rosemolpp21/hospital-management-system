const authcontroller = require('../controller/authenticationcontroller');
const authmodel = require('../model/authenticationModel');
jest.mock('../model/authenticationModel');
describe('authentication Controller', () => {
    describe('register user', () => {
        it('return error if any fields are missing', async() => {
            const req = {
                body: { first_name: 'John', last_name: 'Peter', phone_no: '9234567890', gender: 'Male', age: 22,address:'abc' },
            };
            const res = {
                status: jest.fn().mockReturnThis(), send: jest.fn(),
            };
            await authcontroller.register(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith('all fields required');
        });
    });
});
