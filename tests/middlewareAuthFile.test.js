const jwt = require('jsonwebtoken');
const authenticateAdmin = require('../middleware/authenticateAdmin&user');
const httpMocks = require('node-mocks-http');
describe('authenticateAdmin Middleware', () => {
    const ACCESS_TOKEN_SECRET = 'testsecret';
    let req, res, next;
    beforeEach(() => {
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
        next = jest.fn();
        process.env.ACCESS_TOKEN_SECRET = ACCESS_TOKEN_SECRET;
    });
    test('return error code if the token is missing', () => {
        req.headers['authorization'] = '';
        authenticateAdmin(req, res, next);
        expect(res.statusCode).toBe(401);
        expect(res._getJSONData()).toEqual({
            message: 'access token is missing or invalid',
        });
        expect(next).not.toHaveBeenCalled();
    });
    test('return error code if the token is invalid', () => {
        req.headers['authorization'] = 'Bearer invalidtoken';
        authenticateAdmin(req, res, next);
        expect(res.statusCode).toBe(403);
        expect(res._getJSONData()).toEqual({
            message: 'token is invalid or expired',
        });
        expect(next).not.toHaveBeenCalled();
    });
    test('return success code if the token is valid', () => {
        const payload = { id: 1, role: 'admin' };
        const token = jwt.sign(payload, ACCESS_TOKEN_SECRET);
        req.headers['authorization'] = `Bearer ${token}`;
        authenticateAdmin(req, res, next);
        expect(next).toHaveBeenCalled();
        const decodeddetails = jwt.verify(validToken, ACCESS_TOKEN_SECRET);
        expect(req.user).toEqual(decodeddetails);
    });
});
